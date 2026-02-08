"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    await fetch("/api/auth/signout", { method: "POST" });
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setSigningOut(false);
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Teacher";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="MeeTchr" width={40} height={40} />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-coral-500 bg-clip-text text-transparent">
              MeeTchr
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-pink-600 transition-colors"
            >
              Testimonials
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-24 h-10" />
            ) : user ? (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-pink-600" />
                  </div>
                  <span className="text-sm font-medium max-w-[150px] truncate">
                    {displayName}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {signingOut ? "Signing out..." : "Sign Out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 text-gray-700 hover:text-pink-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
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
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-pink-600 transition-colors"
              >
                Testimonials
              </a>

              {loading ? null : user ? (
                <>
                  <div className="flex items-center gap-2 text-gray-700 pt-2 border-t border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-coral-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-sm font-medium">{displayName}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full px-6 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    {signingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:border-pink-600 transition-colors text-center block"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full px-6 py-2 bg-gradient-to-r from-pink-600 to-coral-500 text-white rounded-lg text-center block"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
