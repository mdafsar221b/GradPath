"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Calculator, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SubjectRow {
    id: number;
    name: string;
    marksObtained: string;
    maxMarks: string;
}

export default function GPACalculator() {
    const [subjects, setSubjects] = useState<SubjectRow[]>([
        { id: 1, name: "Subject 1", marksObtained: "70", maxMarks: "100" },
        { id: 2, name: "Subject 2", marksObtained: "85", maxMarks: "100" },
        { id: 3, name: "Subject 3", marksObtained: "60", maxMarks: "100" },
        { id: 4, name: "Subject 4", marksObtained: "75", maxMarks: "100" },
        { id: 5, name: "Practical", marksObtained: "45", maxMarks: "50" },
    ]);
    const [result, setResult] = useState<{ sgpa: number; percentage: number; totalObtained: number; totalMax: number } | null>(null);

    const addSubject = () => {
        const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
        setSubjects([...subjects, { id: newId, name: `Subject ${newId}`, marksObtained: "", maxMarks: "100" }]);
    };

    const removeSubject = (id: number) => {
        setSubjects(subjects.filter((s) => s.id !== id));
    };

    const updateSubject = (id: number, field: keyof SubjectRow, value: string) => {
        setSubjects(
            subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
        );
    };

    const calculate = () => {
        let totalObtained = 0;
        let totalMax = 0;

        subjects.forEach((subject) => {
            const obtained = parseFloat(subject.marksObtained) || 0;
            const max = parseFloat(subject.maxMarks) || 100;

            if (max > 0) {
                totalObtained += obtained;
                totalMax += max;
            }
        });

        if (totalMax > 0) {
            const percentage = (totalObtained / totalMax) * 100;
            // Formula: SGPA = (Percentage + 7.5) / 10
            const sgpa = (percentage + 7.5) / 10;

            setResult({
                sgpa: parseFloat(sgpa.toFixed(2)),
                percentage: parseFloat(percentage.toFixed(2)),
                totalObtained,
                totalMax
            });
        } else {
            setResult({ sgpa: 0, percentage: 0, totalObtained: 0, totalMax: 0 });
        }
    };

    const reset = () => {
        setSubjects([
            { id: 1, name: "Subject 1", marksObtained: "", maxMarks: "100" },
            { id: 2, name: "Subject 2", marksObtained: "", maxMarks: "100" },
            { id: 3, name: "Subject 3", marksObtained: "", maxMarks: "100" },
            { id: 4, name: "Subject 4", marksObtained: "", maxMarks: "100" },
            { id: 5, name: "Practical", marksObtained: "", maxMarks: "50" },
        ]);
        setResult(null);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Enter Marks Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-muted-foreground mb-2 px-2">
                                <div className="col-span-6 sm:col-span-6">Subject</div>
                                <div className="col-span-3 sm:col-span-3">Obtained</div>
                                <div className="col-span-2 sm:col-span-2">Max</div>
                                <div className="col-span-1"></div>
                            </div>

                            <AnimatePresence initial={false}>
                                {subjects.map((subject) => (
                                    <motion.div
                                        key={subject.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="grid grid-cols-12 gap-2 sm:gap-4 items-center mb-2"
                                    >
                                        <div className="col-span-6 sm:col-span-6">
                                            <Input
                                                placeholder="Name"
                                                value={subject.name}
                                                onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="col-span-3 sm:col-span-3">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={subject.marksObtained}
                                                onChange={(e) => updateSubject(subject.id, "marksObtained", e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="col-span-2 sm:col-span-2">
                                            <Input
                                                type="number"
                                                placeholder="100"
                                                value={subject.maxMarks}
                                                onChange={(e) => updateSubject(subject.id, "maxMarks", e.target.value)}
                                                className="h-9"
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeSubject(subject.id)}
                                                className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                disabled={subjects.length === 1}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            <Button onClick={addSubject} variant="outline" className="w-full mt-4 border-dashed">
                                <Plus className="mr-2 h-4 w-4" /> Add Subject
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 p-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                        <CardHeader className="relative z-10">
                            <CardTitle className="text-primary-foreground">Result Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center py-6 relative z-10">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-xs text-primary-foreground/70 mb-1">SGPA</p>
                                    <div className="text-3xl font-bold">
                                        {result ? result.sgpa : "0.00"}
                                    </div>
                                </div>
                                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                                    <p className="text-xs text-primary-foreground/70 mb-1">Percentage</p>
                                    <div className="text-3xl font-bold">
                                        {result ? result.percentage : "0.00"}%
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/20 rounded-lg p-3 text-sm flex justify-between items-center">
                                <span className="text-primary-foreground/80">Total Marks</span>
                                <span className="font-bold">{result ? `${result.totalObtained} / ${result.totalMax}` : "0 / 0"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={calculate} size="lg" className="w-full shadow-md hover:shadow-lg transition-all">
                            <Calculator className="mr-2 h-4 w-4" /> Calculate
                        </Button>
                        <Button onClick={reset} variant="outline" size="lg" className="w-full">
                            <RefreshCw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                    </div>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Calculation Logic</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs space-y-2">
                            <p>SGPA is estimated from your total percentage.</p>
                            <div className="p-2 bg-secondary rounded border border-border/50">
                                <code>SGPA = (Percentage + 7.5) / 10</code>
                            </div>
                            <p className="text-muted-foreground">This formula is commonly used to convert Percentage back to SGPA.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
