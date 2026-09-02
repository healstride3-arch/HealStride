import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

const isAdminRecord = (data) =>
  data?.type?.toLowerCase?.() === "admin" ||
  data?.role?.toLowerCase?.() === "admin" ||
  data?.isAdmin === true;

const hasAdminAccess = async (currentUser) => {
  if (!currentUser) {
    return false;
  }

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL?.trim();

  if (adminEmail && currentUser.email?.toLowerCase() === adminEmail.toLowerCase()) {
    return true;
  }

  let token = null;

  try {
    token = await currentUser.getIdTokenResult(true);
  } catch (error) {
    console.warn("Admin token claim check skipped:", error);
  }

  if (
    token?.claims?.admin === true ||
    token?.claims?.type === "admin" ||
    token?.claims?.role === "admin"
  ) {
    return true;
  }

  const adminDocs = [
    doc(db, "users", currentUser.uid),
    doc(db, "admins", currentUser.uid),
    doc(db, "adminUsers", currentUser.uid),
  ];

  for (const adminDoc of adminDocs) {
    try {
      const snapshot = await getDoc(adminDoc);

      if (snapshot.exists() && isAdminRecord(snapshot.data())) {
        return true;
      }
    } catch (error) {
      console.warn("Admin document check skipped:", adminDoc.path, error);
    }
  }

  try {
    const nestedAdminSnapshot = await getDocs(
      query(collection(db, currentUser.uid), limit(10))
    );

    return nestedAdminSnapshot.docs.some((item) =>
      isAdminRecord(item.data())
    );
  } catch (error) {
    console.warn("Nested admin collection check skipped:", error);
  }

  return false;
};

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        try {
          const allowed = await hasAdminAccess(currentUser);

          if (mounted) {
            setIsAdmin(allowed);
          }
        } catch (error) {
          console.error("Admin access check failed:", error);

          if (mounted) {
            setIsAdmin(false);
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
