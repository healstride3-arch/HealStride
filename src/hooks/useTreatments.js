import { useMemo } from "react";
import { useFirestoreCollection } from "./useFirestoreCollection";
import {
  ALL_TREATMENTS,
  TREATMENTS_CATEGORIES,
  getTreatmentImage,
  buildNavbarTreatmentsColumns,
} from "../data/treatmentsData";

const normalizeSlug = (value = "") =>
  String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const normalizeTreatment = (treatment) => {
  const slug = normalizeSlug(treatment.slug || treatment.id || treatment.name);

  let name = (treatment.name || treatment.title || slug || "").trim();
  let title = (treatment.title || treatment.name || slug || "").trim();

  // Migrate legacy "Flat Feet Treatment" to "Flat Foot Treatment"
  if (
    slug === "flat-feet-treatment" &&
    (name === "Flat Feet Treatment" || name === "Flat Feet Treatments")
  ) {
    name = "Flat Foot Treatment";
  }
  if (
    slug === "flat-feet-treatment" &&
    (title === "Flat Feet Treatment" || title === "Flat Feet Treatments")
  ) {
    title = "Flat Foot Treatment";
  }

  return {
    ...treatment,
    id: treatment.id || slug,
    slug,
    name,
    title,
    imageUrl: treatment.imageUrl || treatment.image || getTreatmentImage(treatment),
  };
};

export const useTreatments = () => {
  const { items: firestoreTreatments, loading, error } = useFirestoreCollection(
    "treatments",
    {
      fallback: [],
    }
  );

  const treatments = useMemo(() => {
    // 1. Build map of static treatments with alias mapping
    const treatmentsMap = new Map();
    const aliasMap = new Map();

    ALL_TREATMENTS.forEach((treatment) => {
      const normalized = normalizeTreatment(treatment);
      treatmentsMap.set(normalized.slug, normalized);

      if (treatment.id) aliasMap.set(normalizeSlug(treatment.id), normalized.slug);
      if (treatment.slug) aliasMap.set(normalizeSlug(treatment.slug), normalized.slug);
      if (treatment.name) aliasMap.set(normalizeSlug(treatment.name), normalized.slug);
      if (treatment.title) aliasMap.set(normalizeSlug(treatment.title), normalized.slug);
    });

    // 2. Overlay any Firestore treatments onto the static definitions
    for (const firestoreItem of firestoreTreatments || []) {
      const normalized = normalizeTreatment(firestoreItem);
      const targetSlug =
        aliasMap.get(normalizeSlug(firestoreItem.id)) ||
        aliasMap.get(normalizeSlug(firestoreItem.slug)) ||
        aliasMap.get(normalizeSlug(firestoreItem.name)) ||
        aliasMap.get(normalizeSlug(firestoreItem.title)) ||
        normalized.slug;

      const existing = treatmentsMap.get(targetSlug) || {};

      treatmentsMap.set(targetSlug, {
        ...existing,
        ...normalized,
        slug: normalized.slug || existing.slug || targetSlug,
        id: firestoreItem.id || existing.id || targetSlug,
        imageUrl: normalized.imageUrl || existing.imageUrl || getTreatmentImage(normalized),
      });
    }

    return Array.from(treatmentsMap.values()).filter(
      (treatment) => treatment.active !== false
    );
  }, [firestoreTreatments]);

  const categories = useMemo(() => {
    const dynamicCategories = Array.from(
      new Set(treatments.map((item) => item.category).filter(Boolean))
    );

    return [
      "All Conditions",
      ...dynamicCategories.filter((category) => category !== "All Conditions"),
    ].filter((category, index, all) => all.indexOf(category) === index);
  }, [treatments]);

  const navbarColumns = useMemo(() => {
    return buildNavbarTreatmentsColumns(treatments);
  }, [treatments]);

  return {
    treatments,
    categories: categories.length > 1 ? categories : TREATMENTS_CATEGORIES,
    navbarColumns,
    navbarTreatmentsColumns: navbarColumns,
    loading,
    error,
  };
};

export const findTreatmentBySlug = (treatments, slug) => {
  if (!slug) return null;
  const clean = normalizeSlug(slug);

  return (
    treatments.find((t) => t.slug === clean || t.id === clean) ||
    treatments.find((t) => normalizeSlug(t.name) === clean) ||
    treatments.find((t) => normalizeSlug(t.title) === clean) ||
    null
  );
};

export const getRelatedTreatmentItems = (
  treatments,
  currentSlug,
  category,
  limit = 4
) =>
  treatments
    .filter((t) => t.slug !== currentSlug && (!category || t.category === category))
    .slice(0, limit);
