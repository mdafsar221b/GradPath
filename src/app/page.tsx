import Header from "@/components/layout/Header";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import ResourcesPreview from "@/components/landing/ResourcesPreview";
import Footer from "@/components/layout/Footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-grow">
                <Hero />
                <HowItWorks />
                <ResourcesPreview />
            </div>
            <Footer />
        </main>
    );
}
