"use client"

import { AuthProvider } from "@/app/contexts/AuthContext"
import { ThirdwebProvider } from "@thirdweb-dev/react"
import { Sepolia } from "@thirdweb-dev/chains"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider 
      activeChain={Sepolia}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThirdwebProvider>
  )
} 