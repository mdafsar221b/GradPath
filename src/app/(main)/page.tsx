import { Navbar } from "@/components/shared/Navbar";
import { HeroSection } from "@/components/shared/HeroSection";
import { SemestersTabs } from "@/components/landing/SemestersTabs";
import { YouTubeResources } from "@/components/landing/YouTubeResources";
import { ImportantLinks } from "@/components/landing/ImportantLinks";
import { Footer } from "@/components/shared/Footer";
import { ResourceDetails } from "@/data/resources";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SemestersTabs />
        <YouTubeResources resources={ResourceDetails} />
        <ImportantLinks />
      </main>
      <Footer />
    </>
  );
}