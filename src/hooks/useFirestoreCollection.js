import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const useFirestoreCollection = (
  collectionName,
  {
    constraints = [],
    fallback = [],
    mapItem = (item) => item,
  } = {}
) => {
  const [items, setItems] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (!db) {
      setItems(fallback);
      setLoading(false);
      return;
    }

    try {
      const ref = collection(db, collectionName);
      const q = constraints.length > 0 ? query(ref, ...constraints) : ref;

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((docSnap) =>
            mapItem({
              id: docSnap.id,
              ...docSnap.data(),
            })
          );

          setItems(data.length > 0 ? data : fallback);
          setError(null);
          setLoading(false);
        },
        (err) => {
          setItems(fallback);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (syncErr) {
      setItems(fallback);
      setLoading(false);
    }
  }, [collectionName]);

  return { items, loading, error };
};

export { orderBy, where };
