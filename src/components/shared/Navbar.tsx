"use client";

import { useState } from "react";
import { Search, Menu, X, Home, BookOpen, Video, ExternalLink, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchModal } from "./SearchModal"; // Import the SearchModal component

interface NavbarProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Navbar({ darkMode = false, onToggleDarkMode }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Subjects", href: "/subjects", icon: BookOpen },
    { name: "Resources", href: "/resources", icon: Video },
    { name: "Links", href: "/links", icon: ExternalLink },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
                  <BookOpen className="h-5 w-5 text-white dark:text-black" />
                </div>
                <span className="text-xl font-bold text-black dark:text-white">
                  StudyHub
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-black/80 dark:text-white/80 transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center space-x-2 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
              >
                <Search className="h-4 w-4" />
                <span>Search...</span>
                <kbd className="ml-2 rounded border border-black/20 dark:border-white/20 bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-xs">
                  ⌘K
                </kbd>
              </Button>

              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden h-9 w-9 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
              >
                <Search className="h-4 w-4 text-black/60 dark:text-white/60" />
              </Button>

              {/* Dark Mode Toggle */}
              {onToggleDarkMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleDarkMode}
                  className="h-9 w-9 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-black/60 dark:text-white/60" />
                  ) : (
                    <Moon className="h-4 w-4 text-black/60 dark:text-white/60" />
                  )}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden h-9 w-9 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4 text-black/60 dark:text-white/60" />
                ) : (
                  <Menu className="h-4 w-4 text-black/60 dark:text-white/60" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-black/10 dark:border-white/10 bg-white dark:bg-black">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 rounded-lg px-3 py-3 text-base font-medium text-black/80 dark:text-white/80 transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />

      {/* Global keyboard shortcut handler */}
      <div
        className="hidden"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsSearchOpen(true);
          }
        }}
        tabIndex={-1}
      />

      {/* Add global keyboard listener */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('keydown', function(e) {
              if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('open-search'));
              }
            });
          `,
        }}
      />
    </>
  );
}

export default Navbar;