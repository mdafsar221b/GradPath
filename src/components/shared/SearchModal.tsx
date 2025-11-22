"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  BookOpen,
  Video,
  ExternalLink,
  FileText,
  Download,
  ArrowRight,
  X,
  GraduationCap
} from "lucide-react";

interface SearchResult {
  type: 'subject' | 'video' | 'link';
  title: string;
  subtitle?: string;
  href: string;
  semester?: number;
  hasNotes?: boolean;
  hasPYQ?: boolean;
  external?: boolean;
}

interface SearchModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function SearchModal({ isOpen, setIsOpen }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const searchData = useMemo(() => {
    const results: SearchResult[] = [
      {
        type: 'subject',
        title: 'Data Structures and Algorithms',
        subtitle: 'CSE101 - Semester 3',
        href: '/semester/3',
        semester: 3,
        hasNotes: true,
        hasPYQ: true,
      },
      {
        type: 'subject',
        title: 'Database Management Systems',
        subtitle: 'CSE201 - Semester 4',
        href: '/semester/4',
        semester: 4,
        hasNotes: true,
        hasPYQ: false,
      },
      {
        type: 'subject',
        title: 'Operating Systems',
        subtitle: 'CSE301 - Semester 5',
        href: '/semester/5',
        semester: 5,
        hasNotes: false,
        hasPYQ: true,
      },
      {
        type: 'video',
        title: 'Complete DSA Course',
        subtitle: 'CodeWithHarry',
        href: 'https://youtube.com/watch?v=example1',
        external: true,
      },
      {
        type: 'video',
        title: 'DBMS Tutorial',
        subtitle: 'Gate Smashers',
        href: 'https://youtube.com/watch?v=example2',
        external: true,
      },
      {
        type: 'link',
        title: 'University Portal',
        subtitle: 'External Resource',
        href: 'https://university.edu',
        external: true,
      },
      {
        type: 'link',
        title: 'Library Access',
        subtitle: 'External Resource',
        href: 'https://library.university.edu',
        external: true,
      },
    ];

    return results;
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return searchData.slice(0, 8);
    }

    const lowercaseQuery = query.toLowerCase();
    return searchData
      .filter(item =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.subtitle?.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 10);
  }, [query, searchData]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults]);

  const handleResultClick = useCallback((result: SearchResult) => {
    if (result.external) {
      window.open(result.href, '_blank');
    } else {
      window.location.href = result.href;
    }
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredResults.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev === 0 ? filteredResults.length - 1 : prev - 1);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredResults[selectedIndex]) {
            handleResultClick(filteredResults[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, setIsOpen, handleResultClick]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'subject':
        return BookOpen;
      case 'video':
        return Video;
      case 'link':
        return ExternalLink;
      default:
        return Search;
    }
  };

  const getResultBadge = (result: SearchResult) => {
    if (result.type === 'subject') {
      return `Sem ${result.semester}`;
    }
    if (result.type === 'video') {
      return 'Video';
    }
    if (result.type === 'link') {
      return 'Link';
    }
    return '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 pt-4 sm:pt-16">
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg overflow-hidden shadow-2xl mx-auto">
        <div className="flex items-center px-3 sm:px-4 py-3 border-b border-black/10 dark:border-white/10">
          <Search className="w-4 h-4 text-black/40 dark:text-white/40 mr-2 sm:mr-3 flex-shrink-0" />
          <input
            placeholder="Search subjects, videos, links..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4 text-black/60 dark:text-white/60" />
          </button>
        </div>

        <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
          {filteredResults.length > 0 ? (
            <div className="p-1 sm:p-2">
              {filteredResults.map((result, index) => {
                const Icon = getResultIcon(result.type);
                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={`${result.type}-${result.title}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className={`w-full flex items-start sm:items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg text-left transition-all duration-150 ${isSelected
                        ? 'bg-black/10 dark:bg-white/10'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-black/5 dark:bg-white/5 rounded-lg flex-shrink-0 mt-0.5 sm:mt-0">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black/60 dark:text-white/60" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                        <h3 className="font-medium text-sm sm:text-base text-black dark:text-white truncate">
                          {result.title}
                        </h3>
                        <span className="inline-block px-1.5 py-0.5 text-xs bg-black/10 dark:bg-white/10 text-black/60 dark:text-white/60 rounded w-fit">
                          {getResultBadge(result)}
                        </span>
                      </div>

                      {result.subtitle && (
                        <p className="text-xs sm:text-sm text-black/50 dark:text-white/50 truncate mt-0.5">
                          {result.subtitle}
                        </p>
                      )}

                      {result.type === 'subject' && (result.hasNotes || result.hasPYQ) && (
                        <div className="flex items-center space-x-3 mt-1.5">
                          {result.hasNotes && (
                            <div className="flex items-center space-x-1 text-xs text-black/40 dark:text-white/40">
                              <FileText className="w-3 h-3" />
                              <span className="hidden sm:inline">Notes</span>
                              <span className="sm:hidden">N</span>
                            </div>
                          )}
                          {result.hasPYQ && (
                            <div className="flex items-center space-x-1 text-xs text-black/40 dark:text-white/40">
                              <Download className="w-3 h-3" />
                              <span className="hidden sm:inline">PYQ</span>
                              <span className="sm:hidden">P</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      {result.external && (
                        <ExternalLink className="w-3 h-3 text-black/30 dark:text-white/30" />
                      )}
                      <ArrowRight className="w-3 h-3 text-black/30 dark:text-white/30" />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="p-6 sm:p-8 text-center">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-black/20 dark:text-white/20 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm sm:text-base text-black/50 dark:text-white/50 mb-1">No results found</p>
              <p className="text-xs sm:text-sm text-black/30 dark:text-white/30 px-4">
                Try searching for subject names, video titles, or resource types
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4">
              <div className="mb-4">
                <h3 className="text-xs sm:text-sm font-medium text-black/60 dark:text-white/60 mb-2 flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                  Quick Access
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      window.location.href = '/resources';
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <Video className="w-4 h-4 text-black/60 dark:text-white/60 flex-shrink-0" />
                    <span className="text-sm text-black/80 dark:text-white/80">All Videos</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = '/links';
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <ExternalLink className="w-4 h-4 text-black/60 dark:text-white/60 flex-shrink-0" />
                    <span className="text-sm text-black/80 dark:text-white/80">All Links</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:block px-4 py-3 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded border border-black/20 dark:border-white/20">
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded border border-black/20 dark:border-white/20">
                  ↵
                </kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded border border-black/20 dark:border-white/20">
                esc
              </kbd>
              <span>Close</span>
            </div>
          </div>
        </div>

        <div className="sm:hidden px-3 py-2 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <div className="flex items-center justify-center text-xs text-black/50 dark:text-white/50">
            <span>Tap to select • Swipe to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
}