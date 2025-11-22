import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SemesterSelect from "@/components/resources/SemesterSelect";
import { ArrowLeft, Folder } from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Folder size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Previous Year Questions</h1>
              <p className="text-muted-foreground">Access official DDU BCA question papers from previous years.</p>
            </div>
          </div>
        </div>

        <SemesterSelect />
      </main>
      <Footer />
    </div>
  );
}