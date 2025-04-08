"use client"

import { createContext, useContext, useEffect, useState } from "react"
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  userRole: string | null
  loading: boolean
  signUp: (email: string, password: string, role: string, details: { firstName?: string; lastName?: string; manufacturerName?: string }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role)
          }
        } catch (error) {
          console.error("Error fetching user role:", error)
        }
      } else {
        setUserRole(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, role: string, details: { firstName?: string; lastName?: string; manufacturerName?: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      role,
      ...(role === "customer" ? {
        firstName: details.firstName,
        lastName: details.lastName
      } : {
        manufacturerName: details.manufacturerName
      }),
      createdAt: new Date().toISOString()
    })
  }

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = {
    user,
    userRole,
    loading,
    signUp,
    signIn,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 