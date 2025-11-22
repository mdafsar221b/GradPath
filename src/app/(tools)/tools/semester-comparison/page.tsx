import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SemesterComparison from "@/components/tools/SemesterComparison";
import { BarChart3 } from "lucide-react";

export default function SemesterComparisonPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4 border border-primary/10">
                        <BarChart3 className="w-3.5 h-3.5 mr-2" />
                        Performance Analysis
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                        Semester Comparison
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Compare your performance across semesters and visualize your academic progress.
                    </p>
                </div>

                <SemesterComparison />
            </main>
            <Footer />
        </div>
    );
}
