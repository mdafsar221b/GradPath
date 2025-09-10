import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { allSemesters, Subject } from "@/data/subjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileQuestion } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function SemesterPage({ params }: { params: { id: string } }) {
  // (rest of the code remains the same)
  return (
    <>
      <Navbar />
      <main className="container pt-24 pb-16">
        {/* ... */}
      </main>
      <Footer />
    </>
  );
}