import Logo from "@/components/shared/Logo";

export default function Footer() {
    return (
        <footer className="bg-secondary/30 border-t py-12 mt-12">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <Logo />
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} GradPath. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-primary">Privacy Policy</a>
                    <a href="#" className="hover:text-primary">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
