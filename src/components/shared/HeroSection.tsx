import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Video } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-white dark:bg-black">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 text-sm font-medium mb-8 border border-black/10 dark:border-white/10">
          <BookOpen className="w-3.5 h-3.5 mr-2" />
          DDU BCA Academic Resources
        </div>

        {/* Main Heading */}
        <div className="space-y-4 mb-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-black dark:text-white">
            DDU BCA
          </h1>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-black/70 dark:text-white/70">
            Resources
          </h2>
        </div>

        {/* Description */}
        <div className="text-xl md:text-2xl text-black/60 dark:text-white/60 max-w-4xl leading-relaxed mb-8">
          Your comprehensive academic companion for{" "}
          <span className="font-semibold text-black dark:text-white">
            Notes
          </span>
          ,{" "}
          <span className="font-semibold text-black dark:text-white">
            Previous Year Questions
          </span>
          , and{" "}
          <span className="font-semibold text-black dark:text-white">
            curated YouTube resources
          </span>
          {" "}to excel in your studies.
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <div className="flex items-center px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10">
            <FileText className="w-4 h-4 text-black/70 dark:text-white/70 mr-2" />
            <span className="text-sm font-medium text-black/70 dark:text-white/70">Study Notes</span>
          </div>
          <div className="flex items-center px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10">
            <BookOpen className="w-4 h-4 text-black/70 dark:text-white/70 mr-2" />
            <span className="text-sm font-medium text-black/70 dark:text-white/70">Previous Papers</span>
          </div>
          <div className="flex items-center px-4 py-2 bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10">
            <Video className="w-4 h-4 text-black/70 dark:text-white/70 mr-2" />
            <span className="text-sm font-medium text-black/70 dark:text-white/70">Video Resources</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            asChild 
            size="lg" 
            className="group px-8 py-3 text-lg font-semibold rounded-lg bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 text-white dark:text-black shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Link href="/semester" className="flex items-center">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>

          <Button 
            variant="outline" 
            asChild 
            size="lg" 
            className="px-8 py-3 text-lg font-semibold rounded-lg border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white transition-all duration-200"
          >
            <Link href="#links">
              Important Links
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-sm">
          <div className="text-center">
            <div className="text-3xl font-bold text-black dark:text-white">6</div>
            <div className="text-sm text-black/50 dark:text-white/50">Semesters</div>
          </div>
          <div className="text-center border-x border-black/10 dark:border-white/10">
            <div className="text-3xl font-bold text-black dark:text-white">100+</div>
            <div className="text-sm text-black/50 dark:text-white/50">Resources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-black dark:text-white">Free</div>
            <div className="text-sm text-black/50 dark:text-white/50">Always</div>
          </div>
        </div>
      </div>
    </section>
  );
}