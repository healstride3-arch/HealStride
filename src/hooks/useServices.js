import { useMemo } from "react";
import { ALL_SERVICES } from "../data/servicesData";
import { useFirestoreCollection } from "./useFirestoreCollection";

const normalizeSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeService = (service) => {
  const slug = normalizeSlug(service.slug || service.id || service.title);

  return {
    ...service,
    id: service.id || slug,
    slug,
    title: service.title || service.name || slug,
    imageUrl: service.imageUrl || service.image || "",
  };
};

export const useServices = () => {
  const { items: firestoreServices, loading, error } = useFirestoreCollection(
    "services",
    {
      fallback: [],
    }
  );

  const services = useMemo(() => {
    const staticMap = new Map(
      ALL_SERVICES.map((service) => [
        normalizeSlug(service.slug || service.id || service.title),
        normalizeService(service),
      ])
    );

    for (const firestoreService of firestoreServices || []) {
      const normalized = normalizeService(firestoreService);
      const existing = staticMap.get(normalized.slug) || {};

      staticMap.set(normalized.slug, {
        ...existing,
        ...normalized,
      });
    }

    return Array.from(staticMap.values()).filter(
      (service) => service.active !== false
    );
  }, [firestoreServices]);

  return { services, loading, error };
};

export const findServiceBySlug = (services, slug) => {
  const clean = normalizeSlug(slug || "physiotherapy");

  return (
    services.find((service) => service.slug === clean || service.id === clean) ||
    services.find((service) => normalizeSlug(service.title) === clean) ||
    null
  );
};
