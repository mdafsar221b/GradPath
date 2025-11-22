import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings } from 'lucide-react';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
        redirect('/sign-in');
    }

    // Check if user is admin (you can customize this logic)
    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin = user?.emailAddresses[0]?.emailAddress === adminEmail;

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
                        <p className="text-muted-foreground mb-8">
                            You don't have permission to access the admin panel.
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Resources', href: '/admin/resources', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-grow container mx-auto px-4 py-8">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 space-y-2">
                        <div className="bg-card border rounded-lg p-4 mb-4">
                            <h2 className="font-semibold text-lg mb-1">Admin Panel</h2>
                            <p className="text-sm text-muted-foreground">
                                {user?.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">{children}</main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
