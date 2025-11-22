"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, AlertCircle } from "lucide-react";

type InputMode = "marks" | "percentage";

export default function GradePredictor() {
    const [inputMode, setInputMode] = useState<InputMode>("marks");

    // Marks mode
    const [totalMarksObtained, setTotalMarksObtained] = useState<string>("");
    const [totalMaxMarks, setTotalMaxMarks] = useState<string>("");

    // Percentage mode
    const [currentPercentage, setCurrentPercentage] = useState<string>("");

    // Common fields
    const [completedSemesters, setCompletedSemesters] = useState<string>("");
    const [targetPercentage, setTargetPercentage] = useState<string>("");

    const [result, setResult] = useState<{
        requiredPercentage: number;
        requiredMarks: number;
        feasibility: "achievable" | "difficult" | "impossible";
        message: string;
    } | null>(null);

    const calculateRequiredPercentage = () => {
        let currentPercent: number;

        if (inputMode === "marks") {
            const obtained = parseFloat(totalMarksObtained);
            const max = parseFloat(totalMaxMarks);

            if (isNaN(obtained) || isNaN(max) || max <= 0) {
                setResult(null);
                return;
            }

            currentPercent = (obtained / max) * 100;
        } else {
            currentPercent = parseFloat(currentPercentage);

            if (isNaN(currentPercent)) {
                setResult(null);
                return;
            }
        }

        const completed = parseInt(completedSemesters);
        const target = parseFloat(targetPercentage);

        if (isNaN(completed) || isNaN(target)) {
            setResult(null);
            return;
        }

        if (completed < 1 || completed > 6 || currentPercent < 0 || currentPercent > 100 || target < 0 || target > 100) {
            setResult(null);
            return;
        }

        const totalSemesters = 6;
        const remaining = totalSemesters - completed;

        if (remaining <= 0) {
            setResult({
                requiredPercentage: 0,
                requiredMarks: 0,
                feasibility: "impossible",
                message: "You have completed all semesters. Your final percentage is fixed.",
            });
            return;
        }

        // Formula: (current * completed + required * remaining) / total = target
        // Solving for required: required = (target * total - current * completed) / remaining
        const requiredPercentage = (target * totalSemesters - currentPercent * completed) / remaining;
        const requiredMarks = (requiredPercentage / 100) * 500; // Marks out of 500

        let feasibility: "achievable" | "difficult" | "impossible";
        let message: string;

        if (requiredPercentage > 100) {
            feasibility = "impossible";
            message = `Impossible to achieve. You would need ${requiredPercentage.toFixed(2)}% which exceeds the maximum of 100%.`;
        } else if (requiredPercentage < 0) {
            feasibility = "achievable";
            message = `Already achieved! Your current percentage (${currentPercent.toFixed(2)}%) is higher than your target (${target}%).`;
        } else if (requiredPercentage >= 90) {
            feasibility = "difficult";
            message = `Very challenging. You need to maintain an average of ${requiredMarks.toFixed(0)}/500 in the remaining ${remaining} semester(s).`;
        } else if (requiredPercentage >= 70) {
            feasibility = "achievable";
            message = `Achievable with consistent effort. Aim for ${requiredMarks.toFixed(0)}/500 in the remaining ${remaining} semester(s).`;
        } else {
            feasibility = "achievable";
            message = `Easily achievable! You only need ${requiredMarks.toFixed(0)}/500 in the remaining ${remaining} semester(s).`;
        }

        setResult({
            requiredPercentage: parseFloat(requiredPercentage.toFixed(2)),
            requiredMarks: parseFloat(requiredMarks.toFixed(0)),
            feasibility,
            message,
        });
    };

    const getFeasibilityColor = () => {
        if (!result) return "bg-gray-500";
        switch (result.feasibility) {
            case "achievable":
                return "bg-green-500";
            case "difficult":
                return "bg-yellow-500";
            case "impossible":
                return "bg-red-500";
        }
    };

    const getFeasibilityIcon = () => {
        if (!result) return <Target className="w-6 h-6" />;
        switch (result.feasibility) {
            case "achievable":
                return <TrendingUp className="w-6 h-6" />;
            case "difficult":
                return <AlertCircle className="w-6 h-6" />;
            case "impossible":
                return <AlertCircle className="w-6 h-6" />;
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Enter Your Details</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant={inputMode === "marks" ? "default" : "outline"}
                                onClick={() => {
                                    setInputMode("marks");
                                    setResult(null);
                                }}
                                size="sm"
                            >
                                Marks
                            </Button>
                            <Button
                                variant={inputMode === "percentage" ? "default" : "outline"}
                                onClick={() => {
                                    setInputMode("percentage");
                                    setResult(null);
                                }}
                                size="sm"
                            >
                                Percentage
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {inputMode === "marks" ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Total Marks Obtained (All Semesters)</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 1400"
                                        value={totalMarksObtained}
                                        onChange={(e) => {
                                            setTotalMarksObtained(e.target.value);
                                            setResult(null);
                                        }}
                                        min="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Total Max Marks (All Semesters)</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 2000"
                                        value={totalMaxMarks}
                                        onChange={(e) => {
                                            setTotalMaxMarks(e.target.value);
                                            setResult(null);
                                        }}
                                        min="1"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Current Overall Percentage</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 75.5"
                                    value={currentPercentage}
                                    onChange={(e) => {
                                        setCurrentPercentage(e.target.value);
                                        setResult(null);
                                    }}
                                    step="0.01"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Completed Semesters</label>
                            <Input
                                type="number"
                                placeholder="e.g. 4"
                                value={completedSemesters}
                                onChange={(e) => {
                                    setCompletedSemesters(e.target.value);
                                    setResult(null);
                                }}
                                min="1"
                                max="6"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Target Overall Percentage</label>
                            <Input
                                type="number"
                                placeholder="e.g. 80.0"
                                value={targetPercentage}
                                onChange={(e) => {
                                    setTargetPercentage(e.target.value);
                                    setResult(null);
                                }}
                                step="0.01"
                                min="0"
                                max="100"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={calculateRequiredPercentage}
                        className="w-full"
                    >
                        Calculate Required Performance
                    </Button>
                </CardContent>
            </Card>

            {result && (
                <Card className={`${getFeasibilityColor()} text-white`}>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                {getFeasibilityIcon()}
                            </div>
                            <div>
                                <p className="text-sm opacity-90 mb-1">Required Marks (per semester)</p>
                                <p className="text-5xl font-bold">{result.requiredMarks}/500</p>
                                <p className="text-sm opacity-75 mt-2">Required Percentage: {result.requiredPercentage}%</p>
                            </div>
                            <div className="bg-black/20 rounded-lg p-4">
                                <p className="text-sm font-medium capitalize mb-1">{result.feasibility}</p>
                                <p className="text-sm opacity-90">{result.message}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="bg-primary/5 border-primary/10">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">How It Works</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                    <p>This tool calculates the average marks you need to achieve in your remaining semesters to reach your target overall percentage.</p>
                    <p className="font-medium">Formula: Required % = (Target % × 6 - Current % × Completed Semesters) / Remaining Semesters</p>
                    <p className="text-muted-foreground">Marks are calculated assuming 500 marks per semester.</p>
                </CardContent>
            </Card>
        </div>
    );
}
