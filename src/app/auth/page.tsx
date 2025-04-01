import type { Metadata } from "next"
import AuthPage from "@/components/auth-page"

export const metadata: Metadata = {
  title: "TrueTag - Sign In or Register",
  description: "Sign in to your TrueTag account or create a new one to start protecting your products with blockchain-based authentication.",
  keywords: "login, register, authentication, account, sign in, sign up, TrueTag account",
};

export default function Auth() {
  return <AuthPage />
}

