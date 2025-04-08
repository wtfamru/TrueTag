"use client"

import { useState, useEffect } from "react"
import { Camera, QrCode, ShieldAlert, CheckCircle, Search, ChevronRight, AlertTriangle, LogOut, User, Wallet, ChevronDown, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useContract, useAddress, useDisconnect, useConnectionStatus, useConnect, useWallet, metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import ProtectedRoute from "@/app/components/ProtectedRoute"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CustomerDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("scan")
  const [isScanning, setIsScanning] = useState(false)
  const [userName, setUserName] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [productId, setProductId] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<
    | "neutral"
    | "not-registered"
    | "not-claimed"
    | "claimed-by-other"
    | "claimed-by-self"
    | "registered-by-self"
  >("neutral")
  const [productDetails, setProductDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [ownedProducts, setOwnedProducts] = useState<string[]>([])
  const [ownedProductDetails, setOwnedProductDetails] = useState<{[key: string]: any}>({})
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  
  const address = useAddress()
  const connectionStatus = useConnectionStatus()
  const disconnect = useDisconnect()
  const connect = useConnect()
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)

  const wallets = [
    metamaskWallet(),
    coinbaseWallet(),
    walletConnect()
  ]

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
    const fetchOwnedProducts = async () => {
      if (contract && address) {
        try {
          const products = await contract.call("getOwnerProducts", [address])
          setOwnedProducts(products)
          
          // Fetch details for each product
          const productsData: {[key: string]: any} = {}
          for (const productId of products) {
            const product = await contract.call("products", [productId])
            productsData[productId] = product
          }
          setOwnedProductDetails(productsData)
        } catch (err) {
          console.error("Error fetching owned products:", err)
        }
      }
    }
    fetchOwnedProducts()
  }, [contract, address])

  useEffect(() => {
    if (!address) {
      setOwnedProducts([])
      setOwnedProductDetails({})
      setProductDetails(null)
      setVerificationStatus("neutral")
      setProductId("")
    }
  }, [address])

  const handleVerifyProduct = async () => {
    if (!contract || !address) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!productId) {
      toast.error("Please enter a product ID")
      return
    }

    setIsLoading(true)
    try {
      const product = await contract.call("products", [productId])
      setProductDetails(product)

      if (!product.isRegistered) {
        setVerificationStatus("not-registered")
        setProductDetails(null)
        return
      }

      const isClaimed = await contract.call("isProductClaimed", [productId])

      if (product.manufacturer === address) {
        setVerificationStatus("registered-by-self")
      } else if (!isClaimed) {
        setVerificationStatus("not-claimed")
      } else if (product.owner === address) {
        setVerificationStatus("claimed-by-self")
      } else {
        setVerificationStatus("claimed-by-other")
      }
    } catch (err) {
      console.error("Error verifying product:", err)
      toast.error("Error verifying product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimProduct = async () => {
    if (!contract || !address || !userName) {
      toast.error("Please connect your wallet and ensure you're logged in")
      return
    }

    setIsLoading(true)
    try {
      await contract.call("claimProduct", [productId, userName])
      toast.success("Product claimed successfully!")
      
      // Refresh owned products
      const products = await contract.call("getOwnerProducts", [address])
      setOwnedProducts(products)
      
      // Update verification status to claimed-by-self
      const product = await contract.call("products", [productId])
      setProductDetails(product)
      setVerificationStatus("claimed-by-self")
    } catch (err) {
      console.error("Error claiming product:", err)
      toast.error("Failed to claim product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Disconnect wallet first if connected
      if (address) {
        await disconnect()
        setOwnedProducts([])
        setOwnedProductDetails({})
        setProductDetails(null)
        setVerificationStatus("neutral")
        setProductId("")
      }
      // Then logout from Firebase
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setOwnedProducts([])
      setOwnedProductDetails({})
      setProductDetails(null)
      setVerificationStatus("neutral")
      setProductId("")
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  const handleConnect = async (wallet: any) => {
    try {
      if (wallet.id === "metamask") {
        if (window.ethereum) {
          try {
            // First reset permissions to force account selection
            await window.ethereum.request({
              method: "wallet_requestPermissions",
              params: [{ eth_accounts: {} }]
            })
            // Then request accounts to connect
            await window.ethereum.request({
              method: "eth_requestAccounts"
            })
          } catch (err) {
            console.error("Error requesting MetaMask access:", err)
            return
          }
        }
      }
      await connect(wallet)
      setIsWalletModalOpen(false)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast.error("Failed to connect wallet")
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    style={{ borderColor: "#BB5098", color: "#7A5197" }}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    {connectionStatus === "connected" ? address?.slice(0, 6) + "..." + address?.slice(-4) : "Connect Wallet"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-md border rounded-md p-2 min-w-[200px]">
                  {connectionStatus !== "connected" ? (
                    <>
                      {wallets.map((wallet) => (
                        <DropdownMenuItem 
                          key={wallet.id} 
                          onClick={() => handleConnect(wallet)}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <img src={wallet.meta.iconURL} alt={wallet.meta.name} className="w-6 h-6" />
                          <span>{wallet.meta.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem className="hover:bg-gray-100">
                        <span className="text-xs break-all text-gray-500">{address}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDisconnect} className="text-red-600 hover:bg-gray-100">
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-white">
              <TabsTrigger 
                value="scan" 
                className="cursor-pointer data-[state=active]:bg-[#5344A9] data-[state=active]:text-white transition-colors" 
              >
                Scan
              </TabsTrigger>
              <TabsTrigger 
                value="owned" 
                className="cursor-pointer data-[state=active]:bg-[#5344A9] data-[state=active]:text-white transition-colors" 
              >
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
                      <Input 
                        placeholder="Enter product code" 
                        style={{ borderColor: "#BB5098" }}
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        className="cursor-pointer" 
                        style={{ borderColor: "#BB5098", color: "#7A5197" }}
                        onClick={handleVerifyProduct}
                        disabled={isLoading}
                      >
                        {isLoading ? "Verifying..." : "Verify"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-1">
                <Card 
                  style={{ 
                    borderColor: "#BB5098", 
                    backgroundColor: verificationStatus === "neutral" 
                      ? "white"
                      : verificationStatus === "not-registered" 
                      ? "#FEE2E2" 
                      : verificationStatus === "not-claimed"
                      ? "#FEF3C7"
                      : verificationStatus === "claimed-by-other"
                      ? "#FEF3C7"
                      : "#DCFCE7"
                  }}
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    {verificationStatus === "neutral" ? (
                      <>
                        <QrCode className="h-8 w-8" style={{ color: "#5344A9" }} />
                        <div>
                          <CardTitle style={{ color: "#5344A9" }}>Product Verification</CardTitle>
                          <CardDescription style={{ color: "#7A5197" }}>Enter any product ID to verify</CardDescription>
                        </div>
                      </>
                    ) : verificationStatus === "not-registered" ? (
                      <>
                        <XCircle className="h-8 w-8 text-red-600" />
                        <div>
                          <CardTitle className="text-red-600">Product Not Authentic</CardTitle>
                          <CardDescription className="text-red-700">This product ID is not registered in our system</CardDescription>
                        </div>
                      </>
                    ) : verificationStatus === "not-claimed" ? (
                      <>
                        <AlertTriangle className="h-8 w-8 text-yellow-600" />
                        <div>
                          <CardTitle className="text-yellow-600">Product Not Claimed</CardTitle>
                          <CardDescription className="text-yellow-700">This product is authentic but hasn't been claimed yet</CardDescription>
                        </div>
                      </>
                    ) : verificationStatus === "claimed-by-other" ? (
                      <>
                        <AlertTriangle className="h-8 w-8 text-yellow-600" />
                        <div>
                          <CardTitle className="text-yellow-600">Product Might Not Be Authentic</CardTitle>
                          <CardDescription className="text-yellow-700">This product is already claimed by another owner</CardDescription>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <CardTitle className="text-green-600">Authentic Product</CardTitle>
                          <CardDescription className="text-green-700">
                            {verificationStatus === "registered-by-self" 
                              ? "This product is registered"
                              : verificationStatus === "claimed-by-self"
                              ? "Claimed by you"
                              : verificationStatus === "not-claimed"
                              ? "Not yet claimed"
                              : "Claimed by another user"
                            }
                          </CardDescription>
                        </div>
                      </>
                    )}
                  </CardHeader>
                  <CardContent>
                    {verificationStatus !== "neutral" && verificationStatus !== "not-registered" && productDetails && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-700">Product Details</h3>
                          <p className="text-gray-600">{productDetails.name}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Manufacturer</h3>
                          <p className="text-gray-600">{productDetails.manufacturerName}</p>
                          <p className="text-xs text-gray-500 mt-1">Address: {productDetails.manufacturer}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Batch Number</h3>
                          <p className="text-gray-600">{productDetails.batchNumber}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Registration Date</h3>
                          <p className="text-gray-600">
                            {new Date(productDetails.registrationTimestamp * 1000).toLocaleString()}
                          </p>
                        </div>
                        {verificationStatus === "claimed-by-other" && (
                          <div>
                            <h3 className="font-medium text-gray-700">Current Owner</h3>
                            <p className="text-gray-600">{productDetails.ownerName}</p>
                            <p className="text-xs text-gray-500 mt-1">Address: {productDetails.owner}</p>
                          </div>
                        )}
                        {verificationStatus === "not-claimed" && (
                          <div className="mt-6">
                            <Button 
                              className="w-full text-white cursor-pointer"
                              style={{ backgroundColor: "#F47F6B" }}
                              onClick={handleClaimProduct}
                              disabled={isLoading}
                            >
                              {isLoading ? "Claiming..." : "Claim This Product"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Owned Products Tab */}
            <TabsContent value="owned" className="space-y-6">
              <Card style={{ borderColor: "#BB5098" }}>
                <CardHeader>
                  <CardTitle style={{ color: "#5344A9" }}>Owned Products</CardTitle>
                  <CardDescription style={{ color: "#7A5197" }}>Products owned by your wallet</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="py-3">Product ID</TableHead>
                        <TableHead className="py-3">Name</TableHead>
                        <TableHead className="py-3">Batch Number</TableHead>
                        <TableHead className="py-3">Manufacturer</TableHead>
                        <TableHead className="py-3">Date Claimed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ownedProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4" style={{ color: "#7A5197" }}>
                            No owned products found
                          </TableCell>
                        </TableRow>
                      ) : (
                        ownedProducts.map((productId) => {
                          const product = ownedProductDetails[productId]
                          return (
                            <TableRow key={productId}>
                              <TableCell className="py-3" style={{ color: "#5344A9" }}>{productId}</TableCell>
                              <TableCell className="py-3" style={{ color: "#7A5197" }}>
                                {product?.name || "Loading..."}
                              </TableCell>
                              <TableCell className="py-3" style={{ color: "#7A5197" }}>
                                {product?.batchNumber || "Loading..."}
                              </TableCell>
                              <TableCell className="py-3" style={{ color: "#7A5197" }}>
                                {product?.manufacturerName || "Loading..."}
                              </TableCell>
                              <TableCell className="py-3" style={{ color: "#7A5197" }}>
                                {product?.registrationTimestamp 
                                  ? new Date(product.registrationTimestamp * 1000).toLocaleDateString()
                                  : "Loading..."}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
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

