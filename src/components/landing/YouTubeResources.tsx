// src/components/landing/YouTubeResources.tsx
import { YouTubeResource } from "@/data/resources";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Video, Play, ExternalLink, Users } from "lucide-react";

export function YouTubeResources({ resources }: { resources: YouTubeResource[] }) {
  return (
    <section className="w-full py-16 px-4 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 text-sm font-medium mb-4 border border-black/10 dark:border-white/10">
            <Video className="w-3.5 h-3.5 mr-2" />
            Video Resources
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">
            YouTube Resources
          </h2>
          
          <p className="text-lg text-black/60 dark:text-white/60">
            Curated video tutorials and lectures from top educators
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel 
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 text-sm text-black/60 dark:text-white/60">
                <Users className="w-4 h-4" />
                <span>{resources.length} curated videos</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <CarouselPrevious className="relative inset-0 translate-y-0 h-9 w-9 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 bg-white dark:bg-black" />
                <CarouselNext className="relative inset-0 translate-y-0 h-9 w-9 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 bg-white dark:bg-black" />
              </div>
            </div>

            <CarouselContent className="-ml-4">
              {resources.map((resource: YouTubeResource) => (
                <CarouselItem key={resource.title} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Card className="group h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video overflow-hidden rounded-t-lg bg-black/5 dark:bg-white/5">
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
                          
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-5 h-5 bg-black/10 dark:bg-white/10 rounded-full flex items-center justify-center">
                              <Video className="w-3 h-3 text-black/70 dark:text-white/70" />
                            </div>
                            <p className="text-sm text-black/60 dark:text-white/60">
                              {resource.channel}
                            </p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          asChild
                          className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-md transition-all duration-200 group-hover:shadow-md"
                        >
                          <Link 
                            href={resource.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2"
                          >
                            <span className="font-medium">Watch Now</span>
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* View All Button */}
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              asChild
              className="px-6 py-2 font-medium rounded-md border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 text-black dark:text-white"
            >
              <Link href="/resources" className="flex items-center space-x-2">
                <span>View All Resources</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}