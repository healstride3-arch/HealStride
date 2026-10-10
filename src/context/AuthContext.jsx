import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../firebase/firebase";

const AuthContext = createContext();

export const useAuth = () =>
  useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        },
        (authErr) => {
          console.warn("[AuthContext] onAuthStateChanged warning:", authErr?.message);
          setUser(null);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn("[AuthContext] Auth listener initialization warning:", err?.message);
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};