import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calculator, Percent, ArrowRight, Wrench, Binary, BarChart3, ClipboardList, Clock, Calendar, Target } from "lucide-react";
import Link from "next/link";

export default function ToolsPage() {
    const calculatorTools = [
        {
            title: "SGPA Calculator",
            description: "Calculate your Semester Grade Point Average based on marks obtained.",
            icon: Calculator,
            href: "/tools/gpa-calculator",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Percentage to CGPA",
            description: "Convert your Percentage to Cumulative Grade Point Average.",
            icon: Percent,
            href: "/tools/cgpa-converter",
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            title: "Number Converter",
            description: "Convert between Binary, Decimal, Hexadecimal, and Octal number systems.",
            icon: Binary,
            href: "/tools/number-converter",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
        },
    ];

    const analysisTools = [
        {
            title: "Semester Comparison",
            description: "Compare your performance across semesters with visual charts and statistics.",
            icon: BarChart3,
            href: "/tools/semester-comparison",
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            title: "Grade Predictor",
            description: "Calculate what SGPA you need to achieve your target CGPA.",
            icon: Target,
            href: "/tools/grade-predictor",
            color: "text-pink-500",
            bgColor: "bg-pink-500/10",
        },
    ];

    const trackerTools = [
        {
            title: "Assignment Tracker",
            description: "Track your assignments, tutorials, and lab files with deadlines and priorities.",
            icon: ClipboardList,
            href: "/tools/assignment-tracker",
            color: "text-teal-500",
            bgColor: "bg-teal-500/10",
        },
        {
            title: "Exam Countdown",
            description: "Track your upcoming exams with real-time countdowns.",
            icon: Clock,
            href: "/tools/exam-countdown",
            color: "text-red-500",
            bgColor: "bg-red-500/10",
        },
        {
            title: "Study Planner",
            description: "Plan your weekly study schedule and stay organized.",
            icon: Calendar,
            href: "/tools/study-planner",
            color: "text-indigo-500",
            bgColor: "bg-indigo-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4 border border-primary/10">
                        <Wrench className="w-3.5 h-3.5 mr-2" />
                        Student Utilities
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                        Tools & Calculators
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Handy tools to help you track your academic progress, plan your studies, and manage your tasks.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Calculators & Converters */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Calculators & Converters</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {calculatorTools.map((tool) => (
                                <Link key={tool.title} href={tool.href} className="group">
                                    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 border-primary/10">
                                        <CardHeader>
                                            <div className={`w-12 h-12 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center mb-4`}>
                                                <tool.icon size={24} />
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                {tool.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center text-sm font-medium text-primary">
                                                Open Tool <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Analysis & Planning */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Analysis & Planning</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {analysisTools.map((tool) => (
                                <Link key={tool.title} href={tool.href} className="group">
                                    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 border-primary/10">
                                        <CardHeader>
                                            <div className={`w-12 h-12 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center mb-4`}>
                                                <tool.icon size={24} />
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                {tool.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center text-sm font-medium text-primary">
                                                Open Tool <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Trackers & Organizers */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Trackers & Organizers</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trackerTools.map((tool) => (
                                <Link key={tool.title} href={tool.href} className="group">
                                    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 border-primary/10">
                                        <CardHeader>
                                            <div className={`w-12 h-12 rounded-xl ${tool.bgColor} ${tool.color} flex items-center justify-center mb-4`}>
                                                <tool.icon size={24} />
                                            </div>
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                            <CardDescription className="text-base">
                                                {tool.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center text-sm font-medium text-primary">
                                                Open Tool <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
