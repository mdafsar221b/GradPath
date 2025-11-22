"use client";

import { motion } from "framer-motion";
import { Layers, BookOpen, Youtube, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
    {
        icon: Layers,
        title: "Previous Year Questions PYQ",
        description: "Practice with official DDU BCA Question papers from previous years to understand patterns.",
    },
    {
        icon: BookOpen,
        title: "Comprehensive Notes",
        description: "Handwritten & typed notes by top students curated for easy understanding and quick revision.",
    },
    {
        icon: Youtube,
        title: "Curated YouTube Playlists",
        description: "Handpicked video lectures and playlists organized by subject to clear your concepts efficiently.",
    },
];

export default function ResourcesPreview() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {resources.map((resource, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-card border rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col h-full"
                        >
                            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-6 text-primary">
                                <resource.icon size={24} />
                            </div>

                            <h3 className="text-xl font-bold mb-3 text-primary">{resource.title}</h3>
                            <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">
                                {resource.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                                <Button variant="ghost" size="icon" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10">
                                    <ArrowRight size={20} />
                                </Button>
                                <div className="h-1 flex-grow bg-secondary ml-4 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/20 w-full" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
