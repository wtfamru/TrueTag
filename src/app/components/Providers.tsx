"use client"

import { AuthProvider } from "@/app/contexts/AuthContext"
import { ThirdwebProvider } from "@thirdweb-dev/react"
import { Sepolia } from "@thirdweb-dev/chains"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider 
      activeChain={Sepolia}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      modalConfig={{
        theme: "light",
        modalSize: "wide",
        title: "Connect Your Wallet",
        welcomeScreen: {
          title: "Connect Your Wallet",
          subtitle: "Connect your wallet to interact with TrueTag"
        },
        termsOfServiceUrl: "https://your-terms-url.com",
        privacyPolicyUrl: "https://your-privacy-url.com"
      }}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThirdwebProvider>
  )
} 