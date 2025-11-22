"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowRight, FileText, HelpCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 text-center lg:text-left">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary leading-[1.1]"
                >
                    Unlock Your DDU <br className="hidden lg:block" />
                    <span className="text-primary/90">BCA Potential</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0"
                >
                    Access PYQs, Notes, & Curated YouTube Resources - All in One Place. Elevate your study game today.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                >
                    <Button size="lg" className="h-12 px-8 text-base rounded-lg bg-primary hover:bg-primary/90" asChild>
                        <Link href="/resources">
                            Explore Resources <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-12 px-8 text-base rounded-lg border-2 hover:bg-secondary/50"
                        asChild
                    >
                        <Link href="/assets/Resources/Syllabus.pdf" target="_blank">
                            <FileText className="mr-2 h-5 w-5" /> Syllabus
                        </Link>
                    </Button>
                </motion.div>
            </div>

            {/* Right Side Illustration */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex-1 relative w-full max-w-[500px] aspect-square flex items-center justify-center"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />

                {/* Floating Elements */}
                <div className="relative w-full h-full">
                    {/* Main Card */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 z-10 bg-primary text-white p-8 rounded-3xl shadow-2xl rotate-[-6deg]"
                    >
                        <FileText size={64} strokeWidth={1.5} />
                    </motion.div>

                    {/* Secondary Card (White) */}
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                        className="absolute top-1/3 right-1/4 z-20 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 rotate-[12deg]"
                    >
                        <div className="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center">
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                        </div>
                    </motion.div>

                    {/* Small Floating Icon */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-1/3 right-1/3 z-30 bg-white p-4 rounded-2xl shadow-lg"
                    >
                        <HelpCircle className="text-blue-500" size={32} />
                    </motion.div>

                    {/* Blue Square */}
                    <motion.div
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                        className="absolute top-0 right-10 z-0 bg-blue-500 p-6 rounded-2xl shadow-lg opacity-80"
                    >
                        <div className="w-8 h-8 bg-white/20 rounded-full" />
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
