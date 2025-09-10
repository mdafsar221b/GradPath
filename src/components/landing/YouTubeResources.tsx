// src/components/landing/YouTubeResources.tsx
import { YouTubeResource } from "@/data/resources";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export function YouTubeResources({ resources }: { resources: YouTubeResource[] }) {
  return (
    <section className="container py-16">
      <h2 className="text-3xl font-bold mb-8 text-center" id="youtube">YouTube Resources</h2>
      <Carousel>
        <CarouselContent className="-ml-4">
          {resources.map((resource: YouTubeResource) => (
            <CarouselItem key={resource.title} className="pl-4 basis-1/2 md:basis-1/3">
              <Link href={resource.link} target="_blank" rel="noopener noreferrer">
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={resource.thumbnail}
                        alt={resource.title}
                        fill
                        className="object-cover"
                        unoptimized // Add this prop
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.channel}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}