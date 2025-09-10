import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-sm text-center md:text-left text-muted-foreground">
          © {new Date().getFullYear()} DDU BCA Resources. All rights reserved.
        </p>
        <nav className="flex items-center space-x-4">
          <Link href="https://www.ddugorakhpuruniversity.in/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
            DDU University
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            Home
          </Link>
        </nav>
      </div>
    </footer>
  );
}