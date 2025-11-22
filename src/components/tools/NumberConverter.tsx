"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Binary, Copy, Check } from "lucide-react";

type NumberSystem = "binary" | "decimal" | "hexadecimal" | "octal";

export default function NumberConverter() {
    const [inputValue, setInputValue] = useState<string>("");
    const [inputBase, setInputBase] = useState<NumberSystem>("decimal");
    const [results, setResults] = useState<{
        binary: string;
        decimal: string;
        hexadecimal: string;
        octal: string;
    } | null>(null);
    const [error, setError] = useState<string>("");
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const validateInput = (value: string, base: NumberSystem): boolean => {
        if (!value) return false;

        switch (base) {
            case "binary":
                return /^[01]+$/.test(value);
            case "decimal":
                return /^\d+$/.test(value);
            case "hexadecimal":
                return /^[0-9A-Fa-f]+$/.test(value);
            case "octal":
                return /^[0-7]+$/.test(value);
            default:
                return false;
        }
    };

    const convertNumber = (value: string, fromBase: NumberSystem) => {
        if (!validateInput(value, fromBase)) {
            setError(`Invalid ${fromBase} number`);
            setResults(null);
            return;
        }

        setError("");

        let decimalValue: number;

        switch (fromBase) {
            case "binary":
                decimalValue = parseInt(value, 2);
                break;
            case "decimal":
                decimalValue = parseInt(value, 10);
                break;
            case "hexadecimal":
                decimalValue = parseInt(value, 16);
                break;
            case "octal":
                decimalValue = parseInt(value, 8);
                break;
            default:
                return;
        }

        if (isNaN(decimalValue)) {
            setError("Conversion failed");
            setResults(null);
            return;
        }

        setResults({
            binary: decimalValue.toString(2),
            decimal: decimalValue.toString(10),
            hexadecimal: decimalValue.toString(16).toUpperCase(),
            octal: decimalValue.toString(8),
        });
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        if (value) {
            convertNumber(value, inputBase);
        } else {
            setResults(null);
            setError("");
        }
    };

    const handleBaseChange = (base: NumberSystem) => {
        setInputBase(base);
        setInputValue("");
        setResults(null);
        setError("");
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Binary className="w-5 h-5 text-primary" />
                        Input Number
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                        {(["binary", "decimal", "hexadecimal", "octal"] as NumberSystem[]).map((base) => (
                            <Button
                                key={base}
                                variant={inputBase === base ? "default" : "outline"}
                                onClick={() => handleBaseChange(base)}
                                className="capitalize"
                            >
                                {base}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder={`Enter ${inputBase} number`}
                            value={inputValue}
                            onChange={(e) => handleInputChange(e.target.value.trim())}
                            className="text-lg font-mono"
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                </CardContent>
            </Card>

            {results && (
                <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(results).map(([base, value]) => (
                        <Card key={base} className="relative overflow-hidden">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm capitalize flex items-center justify-between">
                                    {base}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => copyToClipboard(value, base)}
                                    >
                                        {copiedField === base ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-secondary rounded-lg">
                                    <p className="text-2xl font-mono font-bold break-all">
                                        {value}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Card className="bg-primary/5 border-primary/10">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Reference</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                        <div><strong>Binary:</strong> 0-1</div>
                        <div><strong>Octal:</strong> 0-7</div>
                        <div><strong>Decimal:</strong> 0-9</div>
                        <div><strong>Hexadecimal:</strong> 0-9, A-F</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
