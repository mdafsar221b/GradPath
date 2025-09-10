// src/app/(resources)/resources/page.tsx
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ResourceDetails, YouTubeResource } from "@/data/resources";
import Image from "next/image";
import Link from "next/link";

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="container pt-24 pb-16">
        <h1 className="text-4xl font-bold mb-8 text-center" id="resources">
          YouTube Resources
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          A curated collection of video tutorials and playlists to help you with your subjects.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ResourceDetails.map((resource: YouTubeResource) => (
            <Link
              key={resource.title}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={resource.thumbnail}
                      alt={resource.title}
                      fill
                      className="rounded-t-lg object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.channel}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}