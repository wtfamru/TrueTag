import type { Metadata } from "next"
import CustomerDashboard from "@/components/customer-dashboard";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export const metadata: Metadata = {
  title: "TrueTag - Customer Dashboard",
  description: "Scan products, verify authenticity, and manage your owned products in the TrueTag customer dashboard.",
  keywords: "customer dashboard, product scanning, authenticity verification, owned products, TrueTag customer",
};

export default function CustomerDashboardPage() {
    return <CustomerDashboard />
}