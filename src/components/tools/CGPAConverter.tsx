"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent, ArrowRightLeft } from "lucide-react";

export default function CGPAConverter() {
    const [percentage, setPercentage] = useState<string>("");
    const [cgpa, setCgpa] = useState<number | null>(null);

    const handleCalculate = (value: string) => {
        setPercentage(value);
        const percentValue = parseFloat(value);
        if (!isNaN(percentValue) && percentValue >= 0 && percentValue <= 100) {
            // Formula: CGPA = Percentage / 9.5
            setCgpa(parseFloat((percentValue / 9.5).toFixed(2)));
        } else {
            setCgpa(null);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5 text-primary" />
                        Percentage to CGPA
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Enter Percentage
                        </label>
                        <Input
                            type="number"
                            placeholder="e.g. 85"
                            value={percentage}
                            onChange={(e) => handleCalculate(e.target.value)}
                            className="text-lg"
                        />
                    </div>

                    <div className="p-6 bg-primary/5 rounded-xl text-center border border-primary/10">
                        <p className="text-sm text-muted-foreground mb-1">Estimated CGPA</p>
                        <div className="text-4xl font-bold text-primary">
                            {cgpa !== null ? cgpa : "--"}
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                        Formula used: CGPA = Percentage / 9.5
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
