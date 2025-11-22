import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AssignmentTracker from "@/components/tools/AssignmentTracker";
import { ClipboardList } from "lucide-react";

export default function AssignmentTrackerPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4 border border-primary/10">
                        <ClipboardList className="w-3.5 h-3.5 mr-2" />
                        Task Management
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                        Assignment Tracker
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Track your assignments, tutorials, and lab files with deadlines and priorities.
                    </p>
                </div>

                <AssignmentTracker />
            </main>
            <Footer />
        </div>
    );
}
