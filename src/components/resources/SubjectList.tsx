"use client";

import { useState } from "react";
import { Subject } from "@/data/subjects";
import SubjectCard from "./SubjectCard";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export default function SubjectList({ subjects, semesterId }: { subjects: Subject[], semesterId: number }) {
    const [query, setQuery] = useState("");

    const filteredSubjects = subjects.filter((subject) =>
        subject.code.toLowerCase().includes(query.toLowerCase()) ||
        subject.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-md mx-auto md:mx-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search by subject code (e.g. BCA-101)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-10 bg-card border-primary/20 focus-visible:ring-primary/30 transition-all hover:border-primary/40"
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((subject) => (
                            <motion.div
                                key={subject.code}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <SubjectCard subject={subject} semesterId={semesterId} />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed"
                        >
                            <p>No subjects found matching &quot;{query}&quot;</p>
                            <button
                                onClick={() => setQuery("")}
                                className="text-primary hover:underline mt-2 text-sm"
                            >
                                Clear search
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
