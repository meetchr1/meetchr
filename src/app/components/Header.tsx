"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="MeeTchr" width={40} height={40} />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-coral-500 bg-clip-text text-transparent">
              MeeTchr
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-gray-700 hover:text-pink-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-gray-700 hover:text-pink-600 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-pink-600 transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-pink-600 transition-colors">
              Testimonials
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="px-6 py-2 text-gray-700 hover:text-pink-600 transition-colors">
              Sign In
            </button>
            <Link href="/survey" className="px-6 py-2 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col gap-4">
              <a href="#how-it-works" className="text-gray-700 hover:text-pink-600 transition-colors">
                How It Works
              </a>
              <a href="#features" className="text-gray-700 hover:text-pink-600 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-pink-600 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-pink-600 transition-colors">
                Testimonials
              </a>
              <button className="w-full px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:border-pink-600 transition-colors">
                Sign In
              </button>
              <Link href="/survey" className="w-full px-6 py-2 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg text-center block">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
