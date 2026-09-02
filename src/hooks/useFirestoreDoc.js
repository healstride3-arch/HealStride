import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useFirestoreDoc = (collectionName, documentId, fallback = {}) => {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = onSnapshot(
      doc(db, collectionName, documentId),
      (snapshot) => {
        setData(snapshot.exists() ? { ...fallback, ...snapshot.data() } : fallback);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error(`Failed to load ${collectionName}/${documentId}:`, err);
        setData(fallback);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, documentId]);

  return { data, loading, error };
};
