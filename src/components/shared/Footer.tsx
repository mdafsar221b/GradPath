import Link from "next/link";
import { BookOpen, ExternalLink, Heart, GraduationCap } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-black/10 dark:border-white/10 bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-black dark:bg-white">
                <BookOpen className="w-4 h-4 text-white dark:text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-black dark:text-white">
                  DDU BCA
                </span>
                <span className="text-xs text-black/50 dark:text-white/50">
                  Resources
                </span>
              </div>
            </div>
            <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed max-w-xs mx-auto md:mx-0">
              Empowering BCA students with comprehensive academic resources and study materials.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-semibold text-black dark:text-white mb-4 flex items-center justify-center space-x-2">
              <GraduationCap className="w-4 h-4" />
              <span>Quick Links</span>
            </h3>
            <div className="space-y-3">
              <Link 
                href="/semesters" 
                className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Semester Resources
              </Link>
              <Link 
                href="/resources" 
                className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                YouTube Resources
              </Link>
              <Link 
                href="/links" 
                className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200"
              >
                Important Links
              </Link>
            </div>
          </div>

          {/* University Link */}
          <div className="text-center md:text-right">
            <h3 className="font-semibold text-black dark:text-white mb-4">
              University Portal
            </h3>
            <Link
              href="https://www.ddugorakhpuruniversity.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 text-sm font-medium"
            >
              <span>DDU University</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/10 dark:border-white/10 pt-6">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-black/50 dark:text-white/50">
              <span>© {currentYear} DDU BCA Resources.</span>
              <span className="hidden sm:inline">All rights reserved.</span>
            </div>

            {/* Made with love */}
            <div className="flex items-center space-x-2 text-sm text-black/50 dark:text-white/50">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span> Afsar</span>
            </div>
          </div>

          {/* Additional info */}
          <div className="text-center mt-4">
            <p className="text-xs text-black/40 dark:text-white/40">
              This platform is created by students, for students. Not officially affiliated with DDU.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}