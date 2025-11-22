"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from "recharts";
import { TrendingUp, Award, AlertCircle } from "lucide-react";

type InputMode = "marks" | "percentage";

interface SemesterData {
    semester: number;
    marksObtained: string;
    maxMarks: string;
    percentage: string;
}

export default function SemesterComparison() {
    const [inputMode, setInputMode] = useState<InputMode>("marks");
    const [semesters, setSemesters] = useState<SemesterData[]>([
        { semester: 1, marksObtained: "", maxMarks: "500", percentage: "" },
        { semester: 2, marksObtained: "", maxMarks: "500", percentage: "" },
        { semester: 3, marksObtained: "", maxMarks: "500", percentage: "" },
        { semester: 4, marksObtained: "", maxMarks: "500", percentage: "" },
        { semester: 5, marksObtained: "", maxMarks: "500", percentage: "" },
        { semester: 6, marksObtained: "", maxMarks: "500", percentage: "" },
    ]);

    const updateSemester = (semester: number, field: keyof SemesterData, value: string) => {
        setSemesters(
            semesters.map((s) => (s.semester === semester ? { ...s, [field]: value } : s))
        );
    };

    const getValidSemesters = () => {
        return semesters.filter((s) => {
            if (inputMode === "marks") {
                const obtained = parseFloat(s.marksObtained);
                const max = parseFloat(s.maxMarks);
                return !isNaN(obtained) && !isNaN(max) && max > 0 && obtained >= 0 && obtained <= max;
            } else {
                const percentage = parseFloat(s.percentage);
                return !isNaN(percentage) && percentage >= 0 && percentage <= 100;
            }
        });
    };

    const getSemesterPercentage = (sem: SemesterData): number => {
        if (inputMode === "marks") {
            const obtained = parseFloat(sem.marksObtained);
            const max = parseFloat(sem.maxMarks);
            return (obtained / max) * 100;
        } else {
            return parseFloat(sem.percentage);
        }
    };

    const calculateStats = () => {
        const validSemesters = getValidSemesters();
        if (validSemesters.length === 0) return null;

        const percentages = validSemesters.map((s) => getSemesterPercentage(s));
        const total = percentages.reduce((sum, val) => sum + val, 0);
        const average = total / percentages.length;
        const best = Math.max(...percentages);
        const worst = Math.min(...percentages);
        const bestSem = validSemesters.find((s) => getSemesterPercentage(s) === best);
        const worstSem = validSemesters.find((s) => getSemesterPercentage(s) === worst);

        // Calculate CGPA from average percentage
        const cgpa = (average + 7.5) / 10;

        return {
            averagePercentage: parseFloat(average.toFixed(2)),
            cgpa: parseFloat(cgpa.toFixed(2)),
            best: { semester: bestSem?.semester, percentage: parseFloat(best.toFixed(2)) },
            worst: { semester: worstSem?.semester, percentage: parseFloat(worst.toFixed(2)) },
            trend: percentages.length > 1 ? (percentages[percentages.length - 1] > percentages[0] ? "improving" : "declining") : "stable",
        };
    };

    const getChartData = () => {
        return getValidSemesters().map((s) => ({
            name: `Sem ${s.semester}`,
            Percentage: parseFloat(getSemesterPercentage(s).toFixed(2)),
        }));
    };

    const stats = calculateStats();
    const chartData = getChartData();

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Enter Marks for Each Semester</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant={inputMode === "marks" ? "default" : "outline"}
                                onClick={() => setInputMode("marks")}
                                size="sm"
                            >
                                Marks
                            </Button>
                            <Button
                                variant={inputMode === "percentage" ? "default" : "outline"}
                                onClick={() => setInputMode("percentage")}
                                size="sm"
                            >
                                Percentage
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {inputMode === "marks" ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-muted-foreground mb-2 px-2">
                                <div className="col-span-4">Semester</div>
                                <div className="col-span-4">Marks Obtained</div>
                                <div className="col-span-4">Max Marks</div>
                            </div>
                            {semesters.map((sem) => (
                                <div key={sem.semester} className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                                    <div className="col-span-4">
                                        <label className="text-sm font-medium">Semester {sem.semester}</label>
                                    </div>
                                    <div className="col-span-4">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={sem.marksObtained}
                                            onChange={(e) => updateSemester(sem.semester, "marksObtained", e.target.value)}
                                            className="text-center"
                                            min="0"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <Input
                                            type="number"
                                            placeholder="500"
                                            value={sem.maxMarks}
                                            onChange={(e) => updateSemester(sem.semester, "maxMarks", e.target.value)}
                                            className="text-center"
                                            min="1"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {semesters.map((sem) => (
                                <div key={sem.semester} className="space-y-2">
                                    <label className="text-sm font-medium">Semester {sem.semester}</label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={sem.percentage}
                                        onChange={(e) => updateSemester(sem.semester, "percentage", e.target.value)}
                                        className="text-center"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {stats && chartData.length > 0 && (
                <>
                    <div className="grid md:grid-cols-4 gap-4">
                        <Card className="bg-primary text-primary-foreground">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm opacity-90 mb-1">Average %</p>
                                    <p className="text-4xl font-bold">{stats.averagePercentage}%</p>
                                    <p className="text-xs opacity-75 mt-1">CGPA: {stats.cgpa}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-green-500 text-white">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <Award className="w-6 h-6 mx-auto mb-2" />
                                    <p className="text-xs opacity-90 mb-1">Best Semester</p>
                                    <p className="text-2xl font-bold">Sem {stats.best.semester}</p>
                                    <p className="text-sm">{stats.best.percentage}%</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-orange-500 text-white">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                                    <p className="text-xs opacity-90 mb-1">Lowest Semester</p>
                                    <p className="text-2xl font-bold">Sem {stats.worst.semester}</p>
                                    <p className="text-sm">{stats.worst.percentage}%</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={stats.trend === "improving" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                                    <p className="text-xs opacity-90 mb-1">Trend</p>
                                    <p className="text-2xl font-bold capitalize">{stats.trend}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Percentage Bar Chart</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Bar dataKey="Percentage" fill="hsl(var(--primary))" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Percentage Trend Line</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="Percentage" stroke="hsl(var(--primary))" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
