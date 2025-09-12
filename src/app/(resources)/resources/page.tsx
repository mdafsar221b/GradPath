// src/app/(resources)/resources/page.tsx
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceDetails, YouTubeResource } from "@/data/resources";
import { Video, Play, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ResourcesPage() {
  return (
    <>
      {/* <Navbar /> */}
      <main className="w-full bg-white dark:bg-black pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 text-sm font-medium mb-4 border border-black/10 dark:border-white/10">
              <Video className="w-3.5 h-3.5 mr-2" />
              All Video Resources
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white" id="resources">
              YouTube Resources
            </h1>
            
            <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto">
              A curated collection of video tutorials and playlists to help you with your subjects
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ResourceDetails.map((resource: YouTubeResource) => (
              <Link
                key={resource.title}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-black/5 dark:bg-white/5">
                      <Image
                        src={resource.thumbnail}
                        alt={resource.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-white dark:bg-black rounded-full shadow-md">
                          <Play className="w-5 h-5 text-black dark:text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>

                      {/* Video badge */}
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                        Video
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-black dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors">
                          {resource.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
                              <Video className="w-3 h-3 text-black/70 dark:text-white/70" />
                            </div>
                            <p className="text-sm text-black/60 dark:text-white/60">
                              {resource.channel}
                            </p>
                          </div>
                          
                          <ExternalLink className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-black/70 dark:group-hover:text-white/70 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {ResourceDetails.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto bg-black/5 dark:bg-white/5 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-black/40 dark:text-white/40" />
              </div>
              <h3 className="text-lg font-medium text-black/80 dark:text-white/80 mb-2">
                No Resources Available
              </h3>
              <p className="text-black/50 dark:text-white/50">
                Video resources will be added soon
              </p>
            </div>
          )}

          {/* Resource Stats */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
              <span className="text-sm font-medium text-black/70 dark:text-white/70">
                {ResourceDetails.length} curated video resources available
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}