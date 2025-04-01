import type { Metadata } from "next"
import ManufacturerDashboard from "@/components/manufacturer-dashboard";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "TrueTag - Manufacturer Dashboard",
  description: "Manage your products, generate QR codes, and track analytics in the TrueTag manufacturer dashboard.",
  keywords: "manufacturer dashboard, product management, QR code generation, analytics, TrueTag manufacturer",
};

export default function ManufacturerDashboardPage() {
    return <ManufacturerDashboard />
}