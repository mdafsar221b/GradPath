"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const semesters = [1, 2, 3, 4, 5, 6];

export default function SemesterSelect() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {semesters.map((sem, index) => (
                <motion.div
                    key={sem}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link
                        href={`/resources/semester/${sem}`}
                        className="group block bg-card border rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-bl-full opacity-50 transition-transform group-hover:scale-110" />

                        <div className="relative z-10">
                            <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Semester</span>
                            <h2 className="text-6xl font-bold text-primary mt-2 mb-8">{sem}</h2>

                            <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                View Subjects <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
