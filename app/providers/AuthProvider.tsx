"use client";

import { app } from "@/config/firebaseconfig";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";

type User = {
  id: string;
  name: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  createNewUser: (email: string, password: string) => Promise<FirebaseUser>;
};

const auth = getAuth(app);

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName ?? "",
          email: firebaseUser.email ?? "",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const createNewUser = async (email: string, password: string): Promise<FirebaseUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    setUser({
      id: firebaseUser.uid,
      name: firebaseUser.displayName ?? "",
      email: firebaseUser.email ?? "",
    });

    return firebaseUser;
  };

  const authInfo: AuthContextType = {
    user,
    setUser,
    createNewUser,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
