import type { Metadata } from "next"
import LandingPage from "./components/landing-page"

export const metadata: Metadata = {
  title: "TrueTag - Protect Your Products From Counterfeiting",
  description: "Secure, verify, and authenticate your products with our advanced QR code technology. Join thousands of businesses that trust our platform.",
  keywords: "product authentication, QR code, blockchain, anti-counterfeiting, supply chain, brand protection, product verification",
};

export default function Home() {
  return <LandingPage />
}
