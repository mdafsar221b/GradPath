import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CGPAConverter from "@/components/tools/CGPAConverter";
import { Percent } from "lucide-react";

export default function CGPAConverterPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4 border border-primary/10">
                        <Percent className="w-3.5 h-3.5 mr-2" />
                        Student Tools
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                        Percentage to CGPA
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Convert your Percentage to Cumulative Grade Point Average (CGPA).
                    </p>
                </div>

                <CGPAConverter />
            </main>
            <Footer />
        </div>
    );
}
