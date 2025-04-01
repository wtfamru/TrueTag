"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Github, Twitter } from "lucide-react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AuthPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("customer")
  const [error, setError] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      await signIn(email, password)
      // Get user role and redirect accordingly
      const userDoc = await getDoc(doc(db, "users", auth.currentUser!.uid))
      const userRole = userDoc.data()?.role

      if (userRole === "customer") {
        router.push("/dashboard/customer")
      } else if (userRole === "manufacturer") {
        router.push("/dashboard/manufacturer")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      await signUp(email, password, role)
      const userDoc = await getDoc(doc(db, "users", auth.currentUser!.uid))
      
      // Store additional user details in Firestore
      await setDoc(doc(db, "users", auth.currentUser!.uid), {
        email,
        role,
        firstName,
        lastName,
        createdAt: new Date().toISOString()
      })

      if (role === "customer") {
        router.push("/dashboard/customer")
      } else if (role === "manufacturer") {
        router.push("/dashboard/manufacturer")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      setError(error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Navbar */}
      <header className="w-full bg-white shadow-sm" style={{ backgroundColor: "#5344A9" }}>
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              TrueTag
            </span>
          </Link>
        </div>
      </header>

      {/* Auth Content */}
      <div className="flex flex-1 items-center justify-center" style={{ backgroundColor: "#5344A9" }}>
        <div
          className="w-full max-w-md space-y-8 rounded-lg border-2 bg-white p-8 shadow-lg"
          style={{ borderColor: "#BB5098" }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold select-none" style={{ color: "#7A5197" }}>
              Welcome
            </h1>
            <p className="mt-2 text-sm text-gray-500 select-none">Sign in to your account or create a new one</p>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-opacity-20 cursor-pointer"
                style={{
                  color: "#5344A9",
                }}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-opacity-20 cursor-pointer"
                style={{
                  color: "#5344A9",
                }}
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: "#5344A9" }}>
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      className="pl-10"
                      style={{ borderColor: "#BB5098" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" style={{ color: "#5344A9" }}>
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs underline hover:text-opacity-80"
                      style={{ color: "#7A5197" }}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoCapitalize="none"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="pl-10"
                      style={{ borderColor: "#BB5098" }}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full transform transition-transform hover:scale-[0.98] active:scale-[0.97] text-white cursor-pointer"
                  style={{ backgroundColor: "#F47F6B", borderColor: "#F47F6B" }}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" style={{ color: "#5344A9" }}>
                      First Name
                    </Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="cursor-text"
                      style={{ borderColor: "#BB5098" }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" style={{ color: "#5344A9" }}>
                      Last Name
                    </Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="cursor-text"
                      style={{ borderColor: "#BB5098" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" style={{ color: "#5344A9" }}>
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      className="pl-10"
                      style={{ borderColor: "#BB5098" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" style={{ color: "#5344A9" }}>
                    Account Type
                  </Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    style={{ borderColor: "#BB5098" }}
                    disabled={isLoading}
                  >
                    <option value="customer">Customer</option>
                    <option value="manufacturer">Manufacturer</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" style={{ color: "#5344A9" }}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="pl-10"
                      style={{ borderColor: "#BB5098" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" style={{ color: "#5344A9" }}>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoCapitalize="none"
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="pl-10"
                      style={{ borderColor: "#BB5098" }}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full transform transition-transform hover:scale-[0.98] active:scale-[0.97] text-white cursor-pointer"
                  style={{ backgroundColor: "#F47F6B", borderColor: "#F47F6B" }}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}