"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    const checkAuthorization = async () => {
      if (loading) return;

      // If user is logged in, check their role
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          
          // If user exists but doesn't have the correct role, send to unauthorized
          if (!userData || !allowedRoles.includes(userData.role)) {
            router.push("/unauthorized");
            return;
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          router.push("/unauthorized");
          return;
        }
      } else {
        // Only redirect to auth if there's no user
        router.push("/auth");
      }
    };

    checkAuthorization();
  }, [user, userRole, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#5344A9" }}>
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !userRole || !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}