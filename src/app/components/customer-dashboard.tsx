"use client"

import { useState, useEffect } from "react"
import { Camera, QrCode, ShieldAlert, CheckCircle, Search, ChevronRight, AlertTriangle, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import  ProtectedRoute  from "@/app/components/ProtectedRoute"

export default function CustomerDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("scan")
  const [isScanning, setIsScanning] = useState(false)
  const [userName, setUserName] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserName(`${userData.firstName} ${userData.lastName}`)
        }
      }
    }
    fetchUserDetails()
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold cursor-default" style={{ color: "#5344A9" }}>
                TrueTag
              </h1>
              <p className="text-sm" style={{ color: "#7A5197" }}>Product Verification</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="cursor-pointer"
                style={{ borderColor: "#BB5098", color: "#7A5197" }}
              >
                Connect Wallet
              </Button>
              <div className="relative">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-4 w-4" style={{ color: "#5344A9" }} />
                  </div>
                  <span style={{ color: "#5344A9" }}>{userName}</span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        style={{ color: "#F47F6B" }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto p-6">
          <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="scan" className="cursor-pointer" style={{ color: "#5344A9" }}>
                Scan
              </TabsTrigger>
              <TabsTrigger value="owned" className="cursor-pointer" style={{ color: "#5344A9" }}>
                Owned Products
              </TabsTrigger>
            </TabsList>

            {/* Scan Tab */}
            <TabsContent value="scan" className="space-y-6">
              <Card style={{ borderColor: "#BB5098" }}>
                <CardHeader>
                  <CardTitle style={{ color: "#5344A9" }}>Scan QR Code</CardTitle>
                  <CardDescription style={{ color: "#7A5197" }}>Verify the authenticity of your product</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div
                    className={`relative mb-6 h-64 w-full max-w-md rounded-lg border-2 ${isScanning ? "border-dashed animate-pulse" : ""}`}
                    style={{ borderColor: "#BB5098" }}
                  >
                    {isScanning ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Camera className="mb-2 h-12 w-12" style={{ color: "#5344A9" }} />
                        <p style={{ color: "#7A5197" }}>Scanning...</p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <QrCode className="mb-2 h-12 w-12" style={{ color: "#5344A9" }} />
                        <p style={{ color: "#7A5197" }}>Position QR code in the frame</p>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full max-w-md flex-col gap-4">
                    <Button
                      className="text-white cursor-pointer"
                      style={{ backgroundColor: "#F47F6B" }}
                      onClick={() => setIsScanning(!isScanning)}
                    >
                      {isScanning ? "Cancel Scan" : "Start Scanning"}
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" style={{ borderColor: "#BB5098", opacity: 0.3 }}></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or enter code manually</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Enter product code" style={{ borderColor: "#BB5098" }} />
                      <Button 
                        variant="outline" 
                        className="cursor-pointer" 
                        style={{ borderColor: "#BB5098", color: "#7A5197" }}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card style={{ borderColor: "#BB5098", backgroundColor: `rgba(245, 198, 60, 0.2)` }}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <CheckCircle className="h-8 w-8" style={{ color: "#5344A9" }} />
                    <div>
                      <CardTitle style={{ color: "#5344A9" }}>Authentic Product</CardTitle>
                      <CardDescription style={{ color: "#7A5197" }}>Last verified: Today at 2:30 PM</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium" style={{ color: "#5344A9" }}>
                          Product Details
                        </h3>
                        <p style={{ color: "#7A5197" }}>Premium Headphones XZ-400</p>
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: "#5344A9" }}>
                          Manufacturer
                        </h3>
                        <p style={{ color: "#7A5197" }}>AudioTech Industries</p>
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: "#5344A9" }}>
                          Date of Manufacture
                        </h3>
                        <p style={{ color: "#7A5197" }}>January 15, 2023</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" style={{ borderColor: "#BB5098", color: "#7A5197" }}>
                      View Full Details <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card style={{ borderColor: "#BB5098", backgroundColor: `rgba(245, 198, 60, 0.2)` }}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <ShieldAlert className="h-8 w-8" style={{ color: "#5344A9" }} />
                    <div>
                      <CardTitle style={{ color: "#5344A9" }}>Warranty Information</CardTitle>
                      <CardDescription style={{ color: "#7A5197" }}>Valid until January 15, 2025</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium" style={{ color: "#5344A9" }}>
                          Warranty Type
                        </h3>
                        <p style={{ color: "#7A5197" }}>Extended Manufacturer Warranty</p>
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: "#5344A9" }}>
                          Coverage
                        </h3>
                        <p style={{ color: "#7A5197" }}>Parts and Labor</p>
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: "#5344A9" }}>
                          Support Contact
                        </h3>
                        <p style={{ color: "#7A5197" }}>support@audiotech.com</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" style={{ borderColor: "#BB5098", color: "#7A5197" }}>
                      Register Warranty <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Owned Products Tab */}
            <TabsContent value="owned" className="space-y-6">
              <Card style={{ borderColor: "#BB5098" }}>
                <CardHeader>
                  <CardTitle style={{ color: "#5344A9" }}>Claim Product</CardTitle>
                  <CardDescription style={{ color: "#7A5197" }}>Enter product code to claim ownership</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-8">
                    <Input placeholder="Enter product code" style={{ borderColor: "#BB5098" }} />
                    <Button 
                      className="text-white cursor-pointer"
                      style={{ backgroundColor: "#F47F6B" }}
                    >
                      Claim
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card style={{ borderColor: "#BB5098" }}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle style={{ color: "#5344A9" }}>Owned Products</CardTitle>
                    <CardDescription style={{ color: "#7A5197" }}>Products owned by your wallet</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search products..." className="pl-8" style={{ borderColor: "#BB5098" }} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border" style={{ borderColor: "#BB5098" }}>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "#BB5098" }}>
                          <th className="p-4 text-left" style={{ color: "#5344A9" }}>Product Name</th>
                          <th className="p-4 text-left" style={{ color: "#5344A9" }}>Token ID</th>
                          <th className="p-4 text-left" style={{ color: "#5344A9" }}>Claim Date</th>
                          <th className="p-4 text-left" style={{ color: "#5344A9" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Example row - you'll need to map through actual data */}
                        <tr className="border-b" style={{ borderColor: "#BB5098" }}>
                          <td className="p-4" style={{ color: "#7A5197" }}>Premium Headphones XZ-400</td>
                          <td className="p-4" style={{ color: "#7A5197" }}>#123456</td>
                          <td className="p-4" style={{ color: "#7A5197" }}>2024-03-20</td>
                          <td className="p-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="cursor-pointer"
                              style={{ borderColor: "#BB5098", color: "#7A5197" }}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function HistoryItem({ product, date, status }: { product: string; date: string; status: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4" style={{ borderColor: "#BB5098" }}>
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `rgba(245, 198, 60, 0.2)` }}
        >
          {status === "authentic" ? (
            <CheckCircle className="h-5 w-5" style={{ color: "#5344A9" }} />
          ) : (
            <AlertTriangle className="h-5 w-5" style={{ color: "#F47F6B" }} />
          )}
        </div>
        <div>
          <h3 className="font-medium" style={{ color: "#5344A9" }}>
            {product}
          </h3>
          <p className="text-sm" style={{ color: "#7A5197" }}>
            Scanned on {date}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          className={status === "authentic" ? "bg-green-100 text-green-800" : "text-white"}
          style={status === "authentic" ? {} : { backgroundColor: "#F47F6B" }}
        >
          {status === "authentic" ? "Authentic" : "Fake"}
        </Badge>
        <Button variant="ghost" size="icon">
          <ChevronRight className="h-4 w-4" style={{ color: "#7A5197" }} />
        </Button>
      </div>
    </div>
  )
}

function AlertItem({ title, description, severity }: { title: string; description: string; severity: string }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: "#F47F6B",
        opacity: severity === "high" ? 1 : 0.7,
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-white" />
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <p className="text-sm text-white">{description}</p>
      <div className="mt-2 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="bg-white hover:bg-white/90"
          style={{ color: "#5344A9", borderColor: "white" }}
        >
          View Details
        </Button>
      </div>
    </div>
  )
}

