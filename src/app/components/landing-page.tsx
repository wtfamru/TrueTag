"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronRight,
  Check,
  Shield,
  Scan,
  QrCode,
  Star,
  ArrowRight,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

export default function LandingPage() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
        style={{ backgroundColor: isScrolled ? "#5344A9" : "transparent" }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: isScrolled ? "white" : "#5344A9" }}>
              TrueTag
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium transition-colors hover:text-opacity-80"
              style={{ color: isScrolled ? "white" : "#5344A9" }}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium transition-colors hover:text-opacity-80"
              style={{ color: isScrolled ? "white" : "#5344A9" }}
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium transition-colors hover:text-opacity-80"
              style={{ color: isScrolled ? "white" : "#5344A9" }}
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium transition-colors hover:text-opacity-80"
              style={{ color: isScrolled ? "white" : "#5344A9" }}
            >
              Pricing
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth">
              <Button
                className="transform transition-transform hover:scale-105 text-white cursor-pointer"
                style={{ backgroundColor: "#F47F6B" }}
              >
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" style={{ color: isScrolled ? "white" : "#5344A9" }} />
            ) : (
              <Menu className="h-6 w-6" style={{ color: isScrolled ? "white" : "#5344A9" }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white p-4 shadow-md" style={{ backgroundColor: "#5344A9" }}>
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-sm font-medium transition-colors hover:text-white/80 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium transition-colors hover:text-white/80 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium transition-colors hover:text-white/80 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium transition-colors hover:text-white/80 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  className="w-full transform transition-transform hover:scale-105 text-white cursor-pointer"
                  style={{ backgroundColor: "#F47F6B" }}
                >
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative overflow-hidden py-20 md:py-32"
          style={{
            background: `linear-gradient(135deg, #5344A9 0%, #7A5197 100%)`,
          }}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
                  Protect Your Products From Counterfeiting
                </h1>
                <p className="text-xl md:text-2xl" style={{ color: "#F5C63C" }}>
                  Secure, verify, and authenticate your products with our advanced QR code technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth-page">
                    <Button
                      className="transform transition-transform hover:scale-105 text-white px-8 py-6 text-lg"
                      style={{ backgroundColor: "#F47F6B" }}
                    >
                      Get Started <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-2 text-white hover:bg-white/10 px-8 py-6 text-lg"
                    style={{ borderColor: "white" }}
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative h-[400px] w-[400px] md:h-[500px] md:w-[500px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px] rounded-2xl bg-white/10 backdrop-blur-sm p-6 shadow-xl">
                      <div className="absolute top-0 left-0 right-0 h-12 bg-white/20 rounded-t-2xl flex items-center px-4">
                        <div className="flex gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                      <div className="mt-12 flex flex-col items-center justify-center h-[calc(100%-3rem)]">
                        <div
                          className="h-48 w-48 border-2 border-dashed rounded-lg flex items-center justify-center"
                          style={{ borderColor: "#BB5098" }}
                        >
                          <QrCode className="h-32 w-32 text-white" />
                        </div>
                        <div className="mt-6 w-full bg-white/20 h-10 rounded-md"></div>
                        <div className="mt-4 w-1/2 bg-white/20 h-10 rounded-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-0 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-yellow-500/10 blur-3xl"></div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-center text-xl font-medium mb-8" style={{ color: "#7A5197" }}>
              Trusted by leading brands worldwide
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-32 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 font-medium">LOGO {i}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4" style={{ color: "#5344A9" }}>
                How It Works
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "#7A5197" }}>
                Our platform makes it easy to protect your products in just three simple steps
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: <QrCode className="h-12 w-12" style={{ color: "#F47F6B" }} />,
                  title: "Generate Unique QR Codes",
                  description:
                    "Create secure, tamper-proof QR codes for each of your products with our easy-to-use platform.",
                },
                {
                  icon: <Scan className="h-12 w-12" style={{ color: "#F47F6B" }} />,
                  title: "Apply to Your Products",
                  description: "Apply the generated QR codes to your products during manufacturing or packaging.",
                },
                {
                  icon: <Shield className="h-12 w-12" style={{ color: "#F47F6B" }} />,
                  title: "Verify Authenticity",
                  description: "Customers can scan the QR code to instantly verify the authenticity of your products.",
                },
              ].map((step, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden transition-all duration-300 hover:shadow-lg group"
                  style={{ borderColor: "#BB5098" }}
                >
                  <div
                    className="absolute top-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: "#BB5098" }}
                  ></div>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-6 p-4 rounded-full bg-gray-50">{step.icon}</div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: "#5344A9" }}>
                      {step.title}
                    </h3>
                    <p style={{ color: "#7A5197" }}>{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/auth-page">
                <Button
                  className="transform transition-transform hover:scale-105 text-white px-8 py-6 text-lg"
                  style={{ backgroundColor: "#F47F6B" }}
                >
                  Start Protecting Your Products <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4" style={{ color: "#5344A9" }}>
                Powerful Features
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "#7A5197" }}>
                Everything you need to protect your brand and products
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Shield className="h-8 w-8" style={{ color: "#F5C63C" }} />,
                  title: "Advanced Security",
                  description: "Military-grade encryption ensures your QR codes cannot be duplicated or tampered with.",
                },
                {
                  icon: <QrCode className="h-8 w-8" style={{ color: "#F5C63C" }} />,
                  title: "Bulk Generation",
                  description: "Generate thousands of unique QR codes at once for efficient production.",
                },
                {
                  icon: <Scan className="h-8 w-8" style={{ color: "#F5C63C" }} />,
                  title: "Instant Verification",
                  description: "Customers can verify authenticity in seconds with any smartphone.",
                },
                {
                  icon: <Star className="h-8 w-8" style={{ color: "#F5C63C" }} />,
                  title: "Analytics Dashboard",
                  description: "Track scans, user locations, and engagement with detailed analytics.",
                },
                {
                  icon: <Check className="h-8 w-8" style={{ color: "#F5C63C" }} />,
                  title: "Counterfeit Alerts",
                  description: "Receive instant notifications when potential counterfeits are detected.",
                },
                {
                  icon: <Shield className="h-8 w-8" style={{ color: "#F5C63C" }} />,
                  title: "API Integration",
                  description: "Seamlessly integrate with your existing systems via our robust API.",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-300 hover:shadow-lg ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                  style={{ borderColor: "#BB5098" }}
                >
                  <CardContent className="p-6">
                    <div
                      className="mb-4 rounded-full bg-opacity-20 p-2 w-fit"
                      style={{ backgroundColor: `rgba(245, 198, 60, 0.2)` }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: "#5344A9" }}>
                      {feature.title}
                    </h3>
                    <p style={{ color: "#7A5197" }}>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4" style={{ color: "#5344A9" }}>
                What Our Customers Say
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "#7A5197" }}>
                Trusted by businesses of all sizes around the world
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "This platform has completely transformed how we protect our products. Counterfeits have decreased by 80% since implementation.",
                  name: "Sarah Johnson",
                  title: "Product Manager, TechGear Inc.",
                },
                {
                  quote:
                    "The ease of integration and powerful analytics have made this an essential tool for our brand protection strategy.",
                  name: "Michael Chen",
                  title: "CEO, LuxBrands",
                },
                {
                  quote:
                    "Our customers love the ability to verify product authenticity instantly. It's added tremendous value to our brand.",
                  name: "Emma Rodriguez",
                  title: "Marketing Director, FashionHub",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="transition-all duration-300 hover:shadow-lg"
                  style={{
                    borderColor: "#BB5098",
                    backgroundColor: `rgba(245, 198, 60, 0.2)`,
                  }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-current" style={{ color: "#F5C63C" }} />
                      ))}
                    </div>
                    <p className="mb-6 text-lg italic" style={{ color: "#7A5197" }}>
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
                      <div>
                        <h4 className="font-bold" style={{ color: "#5344A9" }}>
                          {testimonial.name}
                        </h4>
                        <p className="text-sm" style={{ color: "#7A5197" }}>
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-20"
          style={{
            background: `linear-gradient(135deg, #5344A9 0%, #7A5197 100%)`,
          }}
        >
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Start Protecting Your Products Today</h2>
            <p className="text-xl mb-8" style={{ color: "#F5C63C" }}>
              Join thousands of businesses that trust our platform
            </p>
            <Link href="/auth-page">
              <Button
                className="transform transition-transform hover:scale-105 text-white px-8 py-6 text-lg"
                style={{ backgroundColor: "#F47F6B" }}
              >
                Get Started Now <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: "#5344A9" }} className="py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold mb-4 text-white">TrueTag</h3>
              <p className="text-white/70 mb-4">
                Protecting brands and consumers from counterfeit products with advanced technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-white/80">
                  <Facebook style={{ color: "#F5C63C" }} className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-white/80">
                  <Twitter style={{ color: "#F5C63C" }} className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-white/80">
                  <Instagram style={{ color: "#F5C63C" }} className="h-5 w-5" />
                </a>
                <a href="#" className="text-white hover:text-white/80">
                  <Linkedin style={{ color: "#F5C63C" }} className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/70">
            <p>© 2023 TrueTag. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

