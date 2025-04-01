"use client";

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Unauthorized() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#5344A9" }}>
      <div className="w-full max-w-md space-y-8 rounded-lg border-2 bg-white p-8 shadow-lg text-center"
        style={{ borderColor: "#BB5098" }}>
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <Shield className="h-8 w-8" style={{ color: "#F47F6B" }} />
        </div>
        
        <h1 className="text-3xl font-bold" style={{ color: "#7A5197" }}>
          Unauthorized Access
        </h1>
        
        <p className="text-gray-600">
          {user 
            ? "You don't have permission to access this page. Please use an account with the correct permissions."
            : "Please log in to access this page."
          }
        </p>

        <div className="space-y-4">
          <Link href="/auth">
            <Button
              className="w-full transform transition-transform hover:scale-[0.98] active:scale-[0.97] text-white cursor-pointer"
              style={{ backgroundColor: "#F47F6B" }}
            >
              {user ? "Switch Account" : "Log In"}
            </Button>
          </Link>
          <br></br> <br></br>
          <Link href="/">
            <Button
              variant="outline"
              className="w-full transform transition-transform hover:scale-[0.98] active:scale-[0.97] cursor-pointer"
              style={{ borderColor: "#BB5098", color: "#7A5197" }}
            >
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 