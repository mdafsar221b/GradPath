import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  University,
  ClipboardCheck,
  CalendarCheck,
  Video,
  Github,
  BrainCircuit,
  Link as LinkIcon,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { ImportantLinksData, ImportantLink } from "@/data/links";

const iconComponents: { [key: string]: any } = {
  University,
  ClipboardCheck,
  CalendarCheck,
  Video,
  Github,
  BrainCircuit,
  LinkIcon,
};

export function ImportantLinks() {
  return (
    <section className="w-full py-16 px-4 bg-white dark:bg-black" id="links">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70 text-sm font-medium mb-4 border border-black/10 dark:border-white/10">
            <LinkIcon className="w-3.5 h-3.5 mr-2" />
            External Resources
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">
            Important Links
          </h2>
          
          <p className="text-lg text-black/60 dark:text-white/60">
            Quick access to essential university portals and academic tools
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {ImportantLinksData.map((linkData: ImportantLink) => {
            const Icon = linkData.icon ? iconComponents[linkData.icon] : LinkIcon;
            
            return (
              <Link
                key={linkData.name}
                href={linkData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {/* Icon Container */}
                        <div className="flex items-center justify-center w-10 h-10 bg-black/10 dark:bg-white/10 rounded-lg transition-all duration-200 group-hover:bg-black/20 dark:group-hover:bg-white/20">
                          <Icon className="h-5 w-5 text-black/70 dark:text-white/70" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-semibold text-black dark:text-white group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors leading-tight">
                            {linkData.name}
                          </CardTitle>
                        </div>
                      </div>
                      
                      {/* External link indicator */}
                      <div className="opacity-60 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0">
                        <ExternalLink className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-black/70 dark:group-hover:text-white/70" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Action indicator */}
                    <div className="flex items-center justify-between text-sm text-black/50 dark:text-white/50">
                      <span>Click to visit</span>
                      <ArrowRight className="w-3.5 h-3.5 transform transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-full text-sm text-black/50 dark:text-white/50 border border-black/10 dark:border-white/10">
            <ExternalLink className="w-3 h-3 mr-2" />
            All links open in new tab
          </div>
        </div>
      </div>
    </section>
  );
}