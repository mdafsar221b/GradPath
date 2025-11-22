"use client";

import Link from "next/link";
import Logo from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SearchModal } from "@/components/shared/SearchModal";
import { useState } from "react";
import { Search, Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const navLinks = [
        { name: "Subjects", href: "/resources" },
        { name: "Videos", href: "/videos" },
        { name: "Tools", href: "/tools" },
        { name: "Links", href: "/links" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
            >
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Logo />
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>
                        <Link
                            href="/admin"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block"
                        >
                            Admin
                        </Link>
                        <UserButton afterSignOutUrl="/" />

                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                                        <Menu size={24} />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                    <SheetHeader className="mb-8">
                                        <SheetTitle className="text-left flex items-center gap-2">
                                            <Logo />
                                        </SheetTitle>
                                        <SheetDescription className="text-left">
                                            Navigate through the application
                                        </SheetDescription>
                                    </SheetHeader>
                                    <nav className="flex flex-col gap-2">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className="flex items-center py-3 px-4 text-lg font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-all"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                        <div className="h-px bg-border my-2" />
                                        <Link
                                            href="/admin"
                                            className="flex items-center py-3 px-4 text-lg font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-lg transition-all"
                                        >
                                            Admin
                                        </Link>
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </motion.header>

            <SearchModal isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
        </>
    );
}
