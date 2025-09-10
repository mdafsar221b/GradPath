"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  Menu,
  X,
  BookOpen,
  Video,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navLinks = [
    { 
      href: "/semesters", 
      label: "Semesters", 
      icon: GraduationCap,
      description: "Browse by semester"
    },
    { 
      href: "/resources", 
      label: "YouTube Resources", 
      icon: Video,
      description: "Video tutorials & lectures"
    },
    { 
      href: "/links", 
      label: "Important Links", 
      icon: ExternalLink,
      description: "External resources & portals"
    },
  ];

  const isActiveLink = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Enhanced Logo */}
        <Link
          href="/"
          className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              DDU BCA
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Resources
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = isActiveLink(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                )}
              >
                <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400")} />
                <span>{link.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/20 dark:ring-blue-400/20" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          {/* Enhanced Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="relative w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <div className="relative w-5 h-5">
              <Sun className="absolute inset-0 h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-amber-500" />
              <Moon className="absolute inset-0 h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-500" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>

          {/* Enhanced Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-80 p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-800/50"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      DDU BCA
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Resources
                    </span>
                  </div>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>

              {/* Mobile Navigation */}
              <div className="flex flex-col p-6 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = isActiveLink(link.href);
                  
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "group flex items-center space-x-4 p-4 rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                          isActive 
                            ? "bg-blue-100 dark:bg-blue-900/50" 
                            : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                        )}>
                          <Icon className={cn("w-5 h-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400")} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-base">{link.label}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {link.description}
                          </span>
                        </div>
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>

              {/* Mobile Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200/50 dark:border-slate-800/50">
                <div className="text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Made with ❤️ for DDU BCA Students
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}