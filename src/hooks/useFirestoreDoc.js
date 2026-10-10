import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useFirestoreDoc = (collectionName, documentId, fallback = {}) => {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (!db) {
      setData(fallback);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onSnapshot(
        doc(db, collectionName, documentId),
        (snapshot) => {
          setData(snapshot.exists() ? { ...fallback, ...snapshot.data() } : fallback);
          setError(null);
          setLoading(false);
        },
        (err) => {
          setData(fallback);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (docErr) {
      setData(fallback);
      setLoading(false);
    }
  }, [collectionName, documentId]);

  return { data, loading, error };
};
