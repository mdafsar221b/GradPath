import { Navbar } from "@/components/shared/Navbar";
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
} from "lucide-react";
import Link from "next/link";

const iconComponents: { [key: string]: any } = {
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
    <>
      <Navbar />
      <main className="container pt-24 pb-16">
        <h1 className="text-4xl font-bold mb-8 text-center" id="links">
          Important Links
        </h1>
        <p className="text-center text-muted-foreground mb-12">
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
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{linkData.name}</span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}