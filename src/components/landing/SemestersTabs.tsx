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
  BookOpen,
  GraduationCap,
  ExternalLink,
  Download,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { allSemesters, Subject } from "@/data/subjects";
import { Button } from "@/components/ui/button";

export function SemestersTabs() {
  const tabNames = [
    "Sem I",
    "Sem II", 
    "Sem III",
    "Sem IV",
    "Sem V",
    "Sem VI",
  ];

  return (
    <section className="w-full py-16 px-4 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 text-sm font-medium mb-4 border border-black/10 dark:border-white/10">
            <GraduationCap className="w-3.5 h-3.5 mr-2" />
            Academic Resources
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">
            Semester Resources
          </h2>
          
          <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto">
            Study materials and resources organized by semester
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="Sem I" className="w-full">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <TabsList className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-1">
              {tabNames.map((name) => (
                <TabsTrigger
                  key={name}
                  value={name}
                  className="px-4 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black data-[state=active]:shadow-sm rounded-md text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"
                >
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          {allSemesters.map((semesterSubjects, index) => (
            <TabsContent key={index} value={tabNames[index]} className="mt-0">
              {/* Semester Header */}
              <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white dark:text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black dark:text-white">
                        {tabNames[index]} Resources
                      </h3>
                      <p className="text-sm text-black/60 dark:text-white/60">
                        {semesterSubjects.length} subjects available
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-black/10 dark:bg-white/10 text-black/70 dark:text-white/70 rounded-full text-sm font-medium">
                    {semesterSubjects.length}
                  </div>
                </div>
              </div>

              {/* Subject Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {semesterSubjects.map((subject: Subject) => (
                  <Card
                    key={subject.code}
                    className="group transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-black/10 dark:bg-white/10 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                          <BookOpen className="h-4 w-4 text-black/70 dark:text-white/70" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base font-semibold text-black dark:text-white leading-tight">
                            {subject.name}
                          </CardTitle>
                          <p className="text-sm text-black/50 dark:text-white/50 mt-0.5">
                            {subject.code}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-2">
                      {subject.notes && (
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start h-auto p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md group/btn"
                        >
                          <Link
                            href={subject.notes}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3"
                          >
                            <div className="w-6 h-6 bg-black/10 dark:bg-white/10 rounded flex items-center justify-center">
                              <Eye className="h-3.5 w-3.5 text-black/70 dark:text-white/70" />
                            </div>
                            <div className="flex-1 text-left">
                              <span className="text-sm font-medium text-black/80 dark:text-white/80">
                                Study Notes
                              </span>
                            </div>
                            <ExternalLink className="h-3 w-3 text-black/40 dark:text-white/40 group-hover/btn:text-black/70 dark:group-hover/btn:text-white/70 transition-colors" />
                          </Link>
                        </Button>
                      )}
                      
                      {subject.PYQ && (
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-start h-auto p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md group/btn"
                        >
                          <Link
                            href={subject.PYQ}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3"
                          >
                            <div className="w-6 h-6 bg-black/10 dark:bg-white/10 rounded flex items-center justify-center">
                              <Download className="h-3.5 w-3.5 text-black/70 dark:text-white/70" />
                            </div>
                            <div className="flex-1 text-left">
                              <span className="text-sm font-medium text-black/80 dark:text-white/80">
                                Previous Questions
                              </span>
                            </div>
                            <ExternalLink className="h-3 w-3 text-black/40 dark:text-white/40 group-hover/btn:text-black/70 dark:group-hover/btn:text-white/70 transition-colors" />
                          </Link>
                        </Button>
                      )}

                      {!subject.notes && !subject.PYQ && (
                        <div className="text-center py-3">
                          <p className="text-sm text-black/40 dark:text-white/40">
                            Coming soon
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {semesterSubjects.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-black/40 dark:text-white/40" />
                  </div>
                  <h3 className="text-lg font-medium text-black/80 dark:text-white/80 mb-2">
                    No Resources Available
                  </h3>
                  <p className="text-black/50 dark:text-white/50">
                    Resources will be added soon
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