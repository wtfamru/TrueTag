"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { BarChart3, Package, QrCode, Plus, Search, Download, Filter, MoreVertical, LogOut, User } from "lucide-react"
import ProtectedRoute from "@/app/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ManufacturerDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [userName, setUserName] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [productName, setProductName] = useState("")
  const [batchNumber, setBatchNumber] = useState("")
  const [sequence, setSequence] = useState("")
  const [combinedString, setCombinedString] = useState("")

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

  useEffect(() => {
    // Auto-generate combined string when product details change
    if (productName && batchNumber && sequence) {
      // Replace whitespace with hyphens and convert to uppercase
      const cleanName = productName.replace(/\s+/g, '-').toUpperCase()
      const cleanBatch = batchNumber.toUpperCase()
      const cleanSequence = sequence.toUpperCase()
      const combined = `${cleanBatch}-${cleanName}-${cleanSequence}`
      setCombinedString(combined)
    } else {
      setCombinedString("")
    }
  }, [productName, batchNumber, sequence])

  const handleCopyCombinedString = () => {
    navigator.clipboard.writeText(combinedString)
    // You could add a toast notification here
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["manufacturer"]}>
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold cursor-default" style={{ color: "#5344A9" }}>
              TrueTag
            </h1>
            <p className="text-sm" style={{ color: "#7A5197" }}>Manufacturer Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="cursor-pointer"
              style={{ borderColor: "#BB5098", color: "#7A5197" }}
            >
              Help
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
      <div className="container mx-auto p-4">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-white">
            <TabsTrigger 
              value="overview" 
              className="cursor-pointer data-[state=active]:bg-[#5344A9] data-[state=active]:text-white transition-colors" 
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="cursor-pointer data-[state=active]:bg-[#5344A9] data-[state=active]:text-white transition-colors" 
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value="qr-codes" 
              className="cursor-pointer data-[state=active]:bg-[#5344A9] data-[state=active]:text-white transition-colors" 
            >
              QR Codes
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="cursor-pointer data-[state=active]:bg-[#5344A9] data-[state=active]:text-white transition-colors" 
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatCard title="Total Products" value="128" icon={<Package />} change="+12% from last month" />
              <StatCard title="Active QR Codes" value="1,024" icon={<QrCode />} change="+8% from last month" />
              <StatCard title="Scans This Month" value="5,642" icon={<BarChart3 />} change="+24% from last month" />
            </div>

            <Card style={{ borderColor: "#BB5098" }}>
              <CardHeader className="py-4">
                <CardTitle style={{ color: "#5344A9" }}>Recent Activity</CardTitle>
                <CardDescription style={{ color: "#7A5197" }}>Your latest product registrations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-3">Product</TableHead>
                      <TableHead className="py-3">Batch Number</TableHead>
                      <TableHead className="py-3">Variant</TableHead>
                      <TableHead className="py-3">Sequence</TableHead>
                      <TableHead className="py-3">Date</TableHead>
                      <TableHead className="py-3">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4].map((item) => (
                      <TableRow key={item}>
                        <TableCell className="py-3" style={{ color: "#5344A9" }}>Product {item}</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>BATCH-{1000 + item}</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>V{item}</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>{item * 100}</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>{new Date().toLocaleDateString()}</TableCell>
                        <TableCell className="py-3">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Active
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="py-3">
                <Button variant="outline" className="cursor-pointer" style={{ borderColor: "#BB5098", color: "#7A5197" }}>
                  View All
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card style={{ borderColor: "#BB5098" }}>
              <CardHeader className="py-4">
                <CardTitle style={{ color: "#5344A9" }}>Register New Product</CardTitle>
                <CardDescription style={{ color: "#7A5197" }}>Add a new product to your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <Input 
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        style={{ borderColor: "#BB5098" }}
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <Input 
                        placeholder="Batch Number"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        style={{ borderColor: "#BB5098" }}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Input 
                        type="text" 
                        placeholder="Sequence"
                        value={sequence}
                        onChange={(e) => setSequence(e.target.value)}
                        style={{ borderColor: "#BB5098" }}
                        className="h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="relative">
                      <Input 
                        placeholder="Combined String (auto-generated)"
                        value={combinedString}
                        readOnly 
                        style={{ borderColor: "#BB5098", backgroundColor: "#f9fafb" }}
                        className="h-10 pr-24"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCombinedString}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        style={{ borderColor: "#BB5098", color: "#7A5197" }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit"
                    className="w-full h-11 text-white cursor-pointer text-base font-semibold hover:opacity-90 transition-opacity" 
                    style={{ backgroundColor: "#F47F6B" }}
                  >
                    Register Product
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card style={{ borderColor: "#BB5098" }}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle style={{ color: "#5344A9" }}>Product Inventory</CardTitle>
                  <CardDescription style={{ color: "#7A5197" }}>Manage your registered products</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search by product name, batch number, or variant..." 
                      className="pl-8 w-[300px]" 
                      style={{ borderColor: "#BB5098" }}
                    />
                  </div>
                  <Button variant="outline" style={{ borderColor: "#BB5098" }}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-3">Name</TableHead>
                      <TableHead className="py-3">Category</TableHead>
                      <TableHead className="py-3">QR Codes</TableHead>
                      <TableHead className="py-3">Status</TableHead>
                      <TableHead className="py-3"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <TableRow key={item}>
                        <TableCell className="py-3" style={{ color: "#5344A9" }}>Product {item}</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>Electronics</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>{item * 10}</TableCell>
                        <TableCell className="py-3">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Generate QR</DropdownMenuItem>
                              <DropdownMenuItem>View Analytics</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between py-3">
                <div className="text-sm text-gray-500">Showing 5 of 128 products</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" style={{ borderColor: "#BB5098" }}>
                    Previous
                  </Button>
                  <Button variant="outline" style={{ borderColor: "#BB5098" }}>
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* QR Codes Tab */}
          <TabsContent value="qr-codes" className="space-y-4">
            <Card style={{ borderColor: "#BB5098", backgroundColor: `rgba(245, 198, 60, 0.2)` }}>
              <CardHeader className="py-4">
                <CardTitle style={{ color: "#5344A9" }}>QR Code Generator</CardTitle>
                <CardDescription style={{ color: "#7A5197" }}>Create QR codes for your products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="qr-product" style={{ color: "#5344A9" }}>
                        Select Product
                      </Label>
                      <select
                        id="qr-product"
                        className="w-full rounded-md border p-2 cursor-pointer"
                        style={{ borderColor: "#BB5098" }}
                      >
                        <option>Product 1</option>
                        <option>Product 2</option>
                        <option>Product 3</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qr-quantity" style={{ color: "#5344A9" }}>
                        Quantity
                      </Label>
                      <Input id="qr-quantity" type="number" defaultValue="10" style={{ borderColor: "#BB5098" }} />
                    </div>
                    <Button className="text-white cursor-pointer" style={{ backgroundColor: "#F47F6B" }}>
                      Generate QR Codes
                    </Button>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div
                      className="flex h-48 w-48 items-center justify-center rounded-lg border-2 bg-white"
                      style={{ borderColor: "#BB5098" }}
                    >
                      <QrCode className="h-32 w-32" style={{ color: "#5344A9" }} />
                    </div>
                    <Button variant="outline" className="w-full" style={{ borderColor: "#BB5098", color: "#7A5197" }}>
                      <Download className="mr-2 h-4 w-4" /> Download Sample
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card style={{ borderColor: "#BB5098" }}>
              <CardHeader className="py-4">
                <CardTitle style={{ color: "#5344A9" }}>Recent QR Code Batches</CardTitle>
                <CardDescription style={{ color: "#7A5197" }}>Previously generated QR codes</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-3">Batch ID</TableHead>
                      <TableHead className="py-3">Product</TableHead>
                      <TableHead className="py-3">Quantity</TableHead>
                      <TableHead className="py-3">Date Created</TableHead>
                      <TableHead className="py-3">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4].map((item) => (
                      <TableRow key={item}>
                        <TableCell className="py-3" style={{ color: "#5344A9" }}>BATCH-{1000 + item}</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>Product {item}</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>{item * 25}</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>{new Date().toLocaleDateString()}</TableCell>
                        <TableCell className="py-3">
                          <Button
                            variant="outline"
                            className="h-8"
                            style={{ borderColor: "#BB5098", color: "#7A5197" }}
                          >
                            <Download className="mr-2 h-4 w-4" /> Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <StatCard title="Total Scans" value="24,128" icon={<QrCode />} change="+18% from last month" />
              <StatCard title="Unique Users" value="8,432" icon={<Package />} change="+12% from last month" />
              <StatCard title="Verification Rate" value="98.7%" icon={<BarChart3 />} change="+2.3% from last month" />
            </div>

            <Card style={{ borderColor: "#BB5098" }}>
              <CardHeader className="py-4">
                <CardTitle style={{ color: "#5344A9" }}>Scan Analytics</CardTitle>
                <CardDescription style={{ color: "#7A5197" }}>Scan activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full rounded-lg border" style={{ borderColor: "#BB5098" }}>
                  <div className="flex h-full items-center justify-center">
                    <p style={{ color: "#7A5197" }}>Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card style={{ borderColor: "#BB5098" }}>
                <CardHeader className="py-4">
                  <CardTitle style={{ color: "#5344A9" }}>Top Products</CardTitle>
                  <CardDescription style={{ color: "#7A5197" }}>Most scanned products</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-3">Product</TableHead>
                        <TableHead className="py-3">Scans</TableHead>
                        <TableHead className="py-3">Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4].map((item) => (
                        <TableRow key={item}>
                          <TableCell className="py-3" style={{ color: "#5344A9" }}>Product {item}</TableCell>
                          <TableCell className="py-3" style={{ color: "#7A5197" }}>{(5 - item) * 1000}</TableCell>
                          <TableCell className="py-3" style={{ color: "#7A5197" }}>
                            {item % 2 === 0 ? "↑" : "↓"} {item * 5}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card style={{ borderColor: "#BB5098" }}>
                <CardHeader className="py-4">
                  <CardTitle style={{ color: "#5344A9" }}>Geographic Distribution</CardTitle>
                  <CardDescription style={{ color: "#7A5197" }}>Scan locations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-3">Location</TableHead>
                        <TableHead className="py-3">Scans</TableHead>
                        <TableHead className="py-3">Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {["United States", "Europe", "Asia", "Other"].map((location, index) => (
                        <TableRow key={location}>
                          <TableCell className="py-3" style={{ color: "#5344A9" }}>{location}</TableCell>
                          <TableCell className="py-3" style={{ color: "#7A5197" }}>{(4 - index) * 1000}</TableCell>
                          <TableCell className="py-3" style={{ color: "#7A5197" }}>{Math.floor(40 - index * 10)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  )
}

function StatCard({ title, value, icon, change }: { title: string; value: string; icon: React.ReactNode; change: string }) {
  return (
    <Card style={{ borderColor: "#BB5098" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium" style={{ color: "#5344A9" }}>
          {title}
        </CardTitle>
        <div className="rounded-full p-1" style={{ backgroundColor: `rgba(245, 198, 60, 0.2)` }}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color: "#5344A9" }}>
          {value}
        </div>
        <p className="text-xs text-muted-foreground" style={{ color: "#7A5197" }}>
          {change}
        </p>
      </CardContent>
    </Card>
  )
}

