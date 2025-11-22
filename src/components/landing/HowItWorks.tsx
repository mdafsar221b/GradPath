"use client";

import { motion } from "framer-motion";

const steps = [
    { number: "1", title: "Select Subject" },
    { number: "2", title: "Choose Resource" },
    { number: "3", title: "Study & Excel" },
];

export default function HowItWorks() {
    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 lg:gap-24">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="flex flex-col items-center text-center gap-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-primary shadow-sm">
                                {step.number}
                            </div>
                            <h3 className="font-semibold text-lg text-primary">{step.title}</h3>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">How It Works</h2>
                    <p className="text-muted-foreground">Streamlined access to everything you need to succeed in your BCA journey.</p>
                </div>
            </div>
        </section>
    );
}
