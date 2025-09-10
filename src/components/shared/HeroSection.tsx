import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Video } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50/50 via-white to-blue-50/30 dark:from-slate-950/50 dark:via-slate-900 dark:to-blue-950/20">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Primary gradient orb */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
        {/* Secondary gradient orb */}
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
          <BookOpen className="w-4 h-4 mr-2" />
          DDU BCA Academic Resources
        </div>

        {/* Main Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent">
              DDU BCA
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
        </div>

        {/* Description */}
        <p className="mt-8 text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed text-center">
          Your comprehensive academic companion for{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100 relative">
            Notes
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </span>
          ,{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100 relative">
            Previous Year Questions
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
          </span>
          , and{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100 relative">
            curated YouTube resources
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </span>
          {" "}to excel in your studies.
        </p>

        {/* Feature Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center px-4 py-2 bg-white/70 dark:bg-slate-800/70 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Study Notes</span>
          </div>
          <div className="flex items-center px-4 py-2 bg-white/70 dark:bg-slate-800/70 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Previous Papers</span>
          </div>
          <div className="flex items-center px-4 py-2 bg-white/70 dark:bg-slate-800/70 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
            <Video className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Video Resources</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button 
            asChild 
            size="lg" 
            className="group px-8 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/semester/1" className="flex items-center">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          <Button 
            variant="outline" 
            asChild 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 hover:bg-white dark:hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="#links" className="flex items-center">
              Important Links
            </Link>
          </Button>
        </div>

        {/* Stats/Trust indicators */}
        <div className="mt-16 grid grid-cols-3 gap-8 w-full max-w-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">6</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Semesters</div>
          </div>
          <div className="text-center border-x border-slate-200 dark:border-slate-700">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">100+</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Resources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">Free</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Always</div>
          </div>
        </div>
      </div>
    </section>
  );
}