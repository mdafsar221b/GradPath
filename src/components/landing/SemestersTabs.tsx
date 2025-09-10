"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  FileQuestion,
  Laptop,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Download,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { allSemesters, Subject } from "@/data/subjects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SemestersTabs() {
  const tabNames = [
    "Sem I",
    "Sem II", 
    "Sem III",
    "Sem IV",
    "Sem V",
    "Sem VI",
  ];

  const semesterColors = [
    "from-red-500/20 to-orange-500/20 dark:from-red-600/20 dark:to-orange-600/20",
    "from-orange-500/20 to-yellow-500/20 dark:from-orange-600/20 dark:to-yellow-600/20", 
    "from-yellow-500/20 to-green-500/20 dark:from-yellow-600/20 dark:to-green-600/20",
    "from-green-500/20 to-blue-500/20 dark:from-green-600/20 dark:to-blue-600/20",
    "from-blue-500/20 to-purple-500/20 dark:from-blue-600/20 dark:to-purple-600/20",
    "from-purple-500/20 to-pink-500/20 dark:from-purple-600/20 dark:to-pink-600/20"
  ];

  const semesterIcons = [
    "🌱", "🌿", "🌳", "🎯", "🚀", "🎓"
  ];

  return (
    <section className="container py-24 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900/50 dark:to-blue-950/20 rounded-3xl" />
      
      <div className="relative z-10">
        {/* Enhanced Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50">
            <GraduationCap className="w-4 h-4 mr-2" />
            Academic Resources by Semester
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent">
              Semester Resources
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Comprehensive study materials, notes, and previous year questions organized by semester to support your academic journey
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="Sem I" className="w-full">
          {/* Enhanced TabsList */}
          <div className="flex justify-center mb-12">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              {tabNames.map((name, index) => (
                <TabsTrigger
                  key={name}
                  value={name}
                  className="group relative px-6 py-3 text-sm font-semibold transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">{semesterIcons[index]}</span>
                    <span>{name}</span>
                  </span>
                  
                  {/* Active state glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Enhanced Tabs Content */}
          {allSemesters.map((semesterSubjects, index) => (
            <TabsContent key={index} value={tabNames[index]} className="mt-0">
              {/* Semester header */}
              <div className={`rounded-2xl bg-gradient-to-r ${semesterColors[index]} p-6 mb-8 border border-white/20 dark:border-slate-700/20`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-sm">
                      <span className="text-2xl">{semesterIcons[index]}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {tabNames[index]} Resources
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {semesterSubjects.length} subjects available
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200/50 dark:border-slate-700/50">
                    {semesterSubjects.length} Subjects
                  </div>
                </div>
              </div>

              {/* Enhanced Subject Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {semesterSubjects.map((subject: Subject) => (
                  <Card
                    key={subject.code}
                    className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl"
                  >
                    {/* Card gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${semesterColors[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <CardHeader className="relative z-10 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                              {subject.name}
                            </CardTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                              {subject.code}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      <div className="space-y-3">
                        {subject.notes && (
                          <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 hover:bg-blue-50 dark:hover:bg-blue-950/50 group/button rounded-xl"
                          >
                            <Link
                              href={subject.notes}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-3"
                            >
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg group-hover/button:bg-blue-200 dark:group-hover/button:bg-blue-800/50 transition-colors">
                                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1 text-left">
                                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover/button:text-blue-700 dark:group-hover/button:text-blue-300">
                                  Study Notes
                                </span>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  View comprehensive notes
                                </p>
                              </div>
                              <ExternalLink className="h-3 w-3 text-slate-400 group-hover/button:text-blue-500 transition-colors" />
                            </Link>
                          </Button>
                        )}
                        
                        {subject.PYQ && (
                          <Button
                            asChild
                            variant="ghost"
                            className="w-full justify-start h-auto p-3 hover:bg-green-50 dark:hover:bg-green-950/50 group/button rounded-xl"
                          >
                            <Link
                              href={subject.PYQ}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-3"
                            >
                              <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg group-hover/button:bg-green-200 dark:group-hover/button:bg-green-800/50 transition-colors">
                                <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="flex-1 text-left">
                                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover/button:text-green-700 dark:group-hover/button:text-green-300">
                                  Previous Year Questions
                                </span>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Download PYQ collection
                                </p>
                              </div>
                              <ExternalLink className="h-3 w-3 text-slate-400 group-hover/button:text-green-500 transition-colors" />
                            </Link>
                          </Button>
                        )}

                        {!subject.notes && !subject.PYQ && (
                          <div className="text-center py-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Resources coming soon...
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    {/* Card shine effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] pointer-events-none" 
                         style={{ transition: 'transform 0.8s ease-out, opacity 0.3s ease-out' }} />
                  </Card>
                ))}
              </div>

              {/* Empty state or additional info */}
              {semesterSubjects.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mb-4">
                    <BookOpen className="w-10 h-10 text-slate-500 dark:text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No Resources Available
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Resources for this semester will be added soon.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}