import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExamCountdown from "@/components/tools/ExamCountdown";
import { Clock } from "lucide-react";

export default function ExamCountdownPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4 border border-primary/10">
                        <Clock className="w-3.5 h-3.5 mr-2" />
                        Exam Preparation
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                        Exam Countdown
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Track your upcoming exams with real-time countdowns.
                    </p>
                </div>

                <ExamCountdown />
            </main>
            <Footer />
        </div>
    );
}
