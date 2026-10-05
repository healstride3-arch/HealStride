import { useMemo } from "react";
import { useFirestoreCollection } from "./useFirestoreCollection";
import {
  ALL_TREATMENTS,
  TREATMENTS_CATEGORIES,
  getTreatmentImage,
} from "../data/treatmentsData";

const normalizeSlug = (value = "") =>
  String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const normalizeTreatment = (treatment) => {
  const slug = normalizeSlug(treatment.slug || treatment.id || treatment.name);

  return {
    ...treatment,
    id: treatment.id || slug,
    slug,
    name: treatment.name || treatment.title || slug,
    title: treatment.title || treatment.name || slug,
    imageUrl: treatment.imageUrl || getTreatmentImage(treatment),
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
    const source =
      firestoreTreatments && firestoreTreatments.length > 0
        ? firestoreTreatments
        : ALL_TREATMENTS;

    return source
      .map(normalizeTreatment)
      .filter((treatment) => treatment.active !== false);
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

  return {
    treatments,
    categories: categories.length > 1 ? categories : TREATMENTS_CATEGORIES,
    loading,
    error,
  };
};

export const findTreatmentBySlug = (treatments, slug) => {
  const clean = normalizeSlug(slug);

  return (
    treatments.find((t) => t.slug === clean || t.id === clean) ||
    treatments.find((t) => normalizeSlug(t.name) === clean) ||
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
