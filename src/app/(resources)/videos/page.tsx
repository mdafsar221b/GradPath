import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ResourceDetails, YouTubeResource } from "@/data/resources";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Play, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function VideosPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="w-full pt-12 pb-16 px-4 flex-grow">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4 border border-primary/10">
                            <Video className="w-3.5 h-3.5 mr-2" />
                            All Video Resources
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                            YouTube Resources
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A curated collection of video tutorials and playlists to help you with your subjects.
                        </p>
                    </div>

                    {/* Resources Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {ResourceDetails.map((resource: YouTubeResource) => (
                            <Link
                                key={resource.title}
                                href={resource.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-border overflow-hidden flex flex-col">
                                    <CardContent className="p-0 h-full flex flex-col">
                                        {/* Video Thumbnail */}
                                        <div className="relative aspect-video overflow-hidden bg-muted">
                                            <Image
                                                src={resource.thumbnail}
                                                alt={resource.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                unoptimized
                                            />

                                            {/* Play Button Overlay */}
                                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="flex items-center justify-center w-12 h-12 bg-white/90 rounded-full shadow-lg backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                                                    <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                                                </div>
                                            </div>

                                            {/* Video badge */}
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium rounded uppercase tracking-wider">
                                                Playlist
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-foreground leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                    {resource.title}
                                                </h3>

                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                                            <Video className="w-3 h-3 text-primary" />
                                                        </div>
                                                        <p className="text-xs font-medium text-muted-foreground">
                                                            {resource.channel}
                                                        </p>
                                                    </div>

                                                    <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
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
                            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                <Video className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                No Resources Available
                            </h3>
                            <p className="text-muted-foreground">
                                Video resources will be added soon
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
