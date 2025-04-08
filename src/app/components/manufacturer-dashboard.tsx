"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { BarChart3, Package, QrCode, Plus, Search, Download, Filter, MoreVertical, LogOut, User, Wallet, ChevronDown, Check, ChevronsUpDown } from "lucide-react"
import { useContract, useAddress, useDisconnect, useConnectionStatus, useConnect, useWallet, metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react"
import ProtectedRoute from "@/app/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toaster, toast } from "sonner"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function ManufacturerDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("products")
  const [userName, setUserName] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
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

  const [productName, setProductName] = useState("")
  const [batchNumber, setBatchNumber] = useState("")
  const [sequence, setSequence] = useState("")
  const [combinedString, setCombinedString] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [manufacturerProducts, setManufacturerProducts] = useState<string[]>([])
  const [products, setProducts] = useState<{[key: string]: any}>({})
  const [searchType, setSearchType] = useState<"id" | "batch" | "name">("id")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [openProductCombobox, setOpenProductCombobox] = useState(false)
  const [openBatchCombobox, setOpenBatchCombobox] = useState(false)

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUserName(userData.manufacturerName || "")
        }
      }
    }
    fetchUserDetails()
  }, [user])

  useEffect(() => {
    const fetchManufacturerProducts = async () => {
      if (contract && address) {
        try {
          const productIds = await contract.call("getManufacturerProducts", [address])
          setManufacturerProducts(productIds)
          
          // Fetch details for each product
          const productsData: {[key: string]: any} = {}
          for (const productId of productIds) {
            const product = await contract.call("products", [productId])
            productsData[productId] = product
          }
          setProducts(productsData)
        } catch (err) {
          console.error("Error fetching manufacturer products:", err)
        }
      }
    }
    fetchManufacturerProducts()
  }, [contract, address])

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

  useEffect(() => {
    const filterProducts = async () => {
      if (!searchQuery) {
        setFilteredProducts(manufacturerProducts)
        return
      }

      try {
        const query = searchQuery.toLowerCase()
        const allProducts = [...manufacturerProducts]
        const filtered = []

        for (const productId of allProducts) {
          const product = products[productId]
          if (product) {
            switch (searchType) {
              case "batch":
                if (product.batchNumber && 
                    product.batchNumber.toLowerCase().includes(query)) {
                  filtered.push(productId)
                }
                break
              case "name":
                if (product.name && 
                    product.name.toLowerCase().includes(query)) {
                  filtered.push(productId)
                }
                break
              case "id":
                if (productId.toLowerCase().includes(query)) {
                  filtered.push(productId)
                }
                break
            }
          }
        }
        setFilteredProducts(filtered)
      } catch (err) {
        console.error("Error filtering products:", err)
        setFilteredProducts(manufacturerProducts)
      }
    }

    filterProducts()
  }, [searchQuery, searchType, manufacturerProducts, products])

  // Get unique product names and batch numbers
  const uniqueProducts = useMemo(() => {
    const names = new Set<string>()
    Object.values(products).forEach(product => {
      if (product.name) names.add(product.name)
    })
    return Array.from(names)
  }, [products])

  const uniqueBatches = useMemo(() => {
    const batches = new Set<string>()
    Object.values(products).forEach(product => {
      if (product.batchNumber) batches.add(product.batchNumber)
    })
    return Array.from(batches)
  }, [products])

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

  const handleRegisterProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !address || !userName) {
      setError("Please connect your wallet and ensure you're logged in")
      return
    }

    if (!combinedString || !productName || !batchNumber) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const isRegistered = await contract.call("isProductRegistered", [combinedString])
      if (isRegistered) {
        setError("This product is already registered")
        return
      }

      // Use userName (which now contains manufacturerName) in the contract call
      await contract.call("registerProduct", [combinedString, productName, batchNumber, userName])

      // Reset form and update lists
      setProductName("")
      setBatchNumber("")
      setSequence("")
      setCombinedString("")

      const productIds = await contract.call("getManufacturerProducts", [address])
      setManufacturerProducts(productIds)
      
      const productsData: {[key: string]: any} = {}
      for (const productId of productIds) {
        const product = await contract.call("products", [productId])
        productsData[productId] = product
      }
      setProducts(productsData)

      toast.success("Product registered successfully", {
        description: `${productName} has been registered with ID: ${combinedString}`,
        duration: 5000,
      })
    } catch (err) {
      console.error("Error registering product:", err)
      setError("Failed to register product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add useEffect to handle wallet changes
  useEffect(() => {
    if (!address) {
      // Clear product-related states when wallet is disconnected
      setManufacturerProducts([])
      setProducts({})
      setFilteredProducts([])
      setSelectedProduct("")
      setSelectedBatch("")
    }
  }, [address])

  const handleDisconnect = async () => {
    try {
      await disconnect()
      // Clear states after disconnection
      setManufacturerProducts([])
      setProducts({})
      setFilteredProducts([])
      setSelectedProduct("")
      setSelectedBatch("")
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
    <ProtectedRoute allowedRoles={["manufacturer"]}>
    <div className="min-h-screen bg-gray-100">
      <Toaster richColors position="top-center" />
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
      <div className="container mx-auto p-4">
        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-white">
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
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <Card style={{ borderColor: "#BB5098" }}>
              <CardHeader className="py-4">
                <CardTitle style={{ color: "#5344A9" }}>Register New Product</CardTitle>
                <CardDescription style={{ color: "#7A5197" }}>Add a new product to your inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegisterProduct} className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="productName" style={{ color: "#5344A9" }}>Product Name</Label>
                      <Input 
                        id="productName"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value.toUpperCase())}
                        style={{ borderColor: "#BB5098" }}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="batchNumber" style={{ color: "#5344A9" }}>Batch Number</Label>
                      <Input 
                        id="batchNumber"
                        placeholder="Enter batch number"
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value.toUpperCase())}
                        style={{ borderColor: "#BB5098" }}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="sequence" style={{ color: "#5344A9" }}>Sequence Number</Label>
                    <Input 
                      id="sequence"
                      placeholder="Enter sequence number"
                      value={sequence}
                      onChange={(e) => setSequence(e.target.value)}
                      style={{ borderColor: "#BB5098" }}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="combinedString" style={{ color: "#5344A9" }}>Product ID (Auto-generated)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="combinedString"
                        value={combinedString}
                        readOnly
                        style={{ borderColor: "#BB5098", backgroundColor: "#f9fafb" }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopyCombinedString}
                        style={{ borderColor: "#BB5098", color: "#7A5197" }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  <Button 
                    type="submit"
                    style={{ backgroundColor: "#F47F6B", color: "white" }}
                    disabled={isLoading || !contract || !address}
                    className={`w-full ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {isLoading ? "Registering..." : "Register Product"}
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
                  <div className="relative flex items-center gap-2">
                    <select
                      className="h-10 rounded-md border px-3 py-2"
                      style={{ borderColor: "#BB5098" }}
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value as "id" | "batch" | "name")}
                    >
                      <option value="id">Product ID</option>
                      <option value="batch">Batch Number</option>
                      <option value="name">Product Name</option>
                    </select>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder={`Search by ${
                          searchType === 'id' ? 'product ID' : 
                          searchType === 'batch' ? 'batch number' : 
                          'product name'
                        }...`}
                        className="pl-8 w-[300px]" 
                        style={{ borderColor: "#BB5098" }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
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
                      <TableHead className="py-3">Product ID</TableHead>
                      <TableHead className="py-3">Name</TableHead>
                      <TableHead className="py-3">Batch Number</TableHead>
                      <TableHead className="py-3">Status</TableHead>
                      <TableHead className="py-3">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((productId) => (
                      <TableRow key={productId}>
                        <TableCell className="py-3" style={{ color: "#5344A9" }}>{productId}</TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>
                          {products[productId]?.name || "Loading..."}
                        </TableCell>
                        <TableCell className="py-3" style={{ color: "#7A5197" }}>
                          {products[productId]?.batchNumber || "Loading..."}
                        </TableCell>
                        <TableCell className="py-3">
                          {products[productId]?.isClaimed ? (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              Claimed
                            </span>
                          ) : (
                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                              Unclaimed
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3">
                          <Button
                            variant="outline"
                            className="h-8"
                            style={{ borderColor: "#BB5098", color: "#7A5197" }}
                          >
                            <Download className="mr-2 h-4 w-4" /> Download QR
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4" style={{ color: "#7A5197" }}>
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between py-3">
                <div className="text-sm text-gray-500">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} out of {manufacturerProducts.length}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" style={{ borderColor: "#BB5098" }} className="cursor-pointer">
                    Previous
                  </Button>
                  <Button variant="outline" style={{ borderColor: "#BB5098" }} className="cursor-pointer">
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
                      <Label htmlFor="product-name" style={{ color: "#5344A9" }}>
                        Select Product
                      </Label>
                      <Popover open={openProductCombobox} onOpenChange={setOpenProductCombobox}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openProductCombobox}
                            className="w-full justify-between"
                            style={{ borderColor: "#BB5098" }}
                          >
                            {selectedProduct || "Select product..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white" 
                          style={{ width: "100%" }}
                        >
                          <Command>
                            <CommandInput placeholder="Search products..." />
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandGroup>
                              {uniqueProducts.map((name) => (
                                <CommandItem
                                  key={name}
                                  value={name}
                                  onSelect={(currentValue) => {
                                    setSelectedProduct(currentValue === selectedProduct ? "" : currentValue)
                                    setOpenProductCombobox(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedProduct === name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batch-number" style={{ color: "#5344A9" }}>
                        Batch Number
                      </Label>
                      <Popover open={openBatchCombobox} onOpenChange={setOpenBatchCombobox}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openBatchCombobox}
                            className="w-full justify-between"
                            style={{ borderColor: "#BB5098" }}
                          >
                            {selectedBatch || "Select batch..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white" 
                          style={{ width: "100%" }}
                        >
                          <Command>
                            <CommandInput placeholder="Search batches..." />
                            <CommandEmpty>No batch found.</CommandEmpty>
                            <CommandGroup>
                              {uniqueBatches.map((batch) => (
                                <CommandItem
                                  key={batch}
                                  value={batch}
                                  onSelect={(currentValue) => {
                                    setSelectedBatch(currentValue === selectedBatch ? "" : currentValue)
                                    setOpenBatchCombobox(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedBatch === batch ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {batch}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button 
                      className="text-white cursor-pointer w-full" 
                      style={{ backgroundColor: "#F47F6B" }}
                      disabled={!selectedProduct || !selectedBatch}
                    >
                      <Download className="mr-2 h-4 w-4" /> Generate QR Codes
                    </Button>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div
                      className="flex h-48 w-48 items-center justify-center rounded-lg border-2 bg-white"
                      style={{ borderColor: "#BB5098" }}
                    >
                      <QrCode className="h-32 w-32" style={{ color: "#5344A9" }} />
                    </div>
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

