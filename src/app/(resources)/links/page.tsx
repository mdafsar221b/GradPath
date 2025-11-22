import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ImportantLinksData, ImportantLink } from "@/data/links";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  University,
  ClipboardCheck,
  CalendarCheck,
  Video,
  Github,
  BrainCircuit,
  Link as LinkIcon,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

const iconComponents: { [key: string]: LucideIcon } = {
  University,
  ClipboardCheck,
  CalendarCheck,
  Video,
  Github,
  BrainCircuit,
  LinkIcon,
};

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8 text-center text-primary" id="links">
          Important Links
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          A collection of useful links for your academic and professional development.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ImportantLinksData.map((linkData: ImportantLink) => {
            const Icon = linkData.icon ? iconComponents[linkData.icon] : LinkIcon;
            return (
              <Link
                key={linkData.name}
                href={linkData.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-lg">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-foreground">{linkData.name}</span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}