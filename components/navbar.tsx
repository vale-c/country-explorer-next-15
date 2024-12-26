"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b dark:border-gray-700 border-gray-300 dark:bg-black/80 bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-primary dark:text-gray-200 hover:opacity-90 transition-opacity"
            >
              TechNomadHub
            </Link>
          </div>

          {/* Links and ModeToggle */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/countries"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-gray-100 transition-colors"
            >
              Countries
            </Link>
            <Link
              href="/cost-of-living"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-gray-100 transition-colors"
            >
              Cost of Living{" "}
              <span className="text-gray-500 dark:text-gray-400">
                (by Country)
              </span>
            </Link>
            <Link
              href="/cost-of-living/cities"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-gray-100 transition-colors"
            >
              Cost of Living{" "}
              <span className="text-gray-500 dark:text-gray-400">
                (by City)
              </span>
            </Link>
            <ModeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="sr-only">Toggle menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t dark:border-gray-700 border-gray-300">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/countries"
              className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-gray-100 px-3 py-2 rounded-md"
            >
              Countries
            </Link>
            <Link
              href="/cost-of-living"
              className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-gray-100 px-3 py-2 rounded-md"
            >
              Cost of Living
            </Link>
          </div>
          <div className="px-4 py-3 border-t dark:border-gray-700 border-gray-300">
            <ModeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
