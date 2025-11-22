import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import dbConnect from '@/lib/mongodb';
import { Resource } from '@/lib/models/Resource';

export const dynamic = 'force-dynamic';

async function getStats() {
    try {
        await dbConnect();

        const totalResources = await Resource.countDocuments();
        const uniqueSubjects = await Resource.distinct('subjectCode');

        // Get resources from this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthResources = await Resource.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        return {
            totalResources,
            totalSubjects: uniqueSubjects.length,
            thisMonth: thisMonthResources,
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {
            totalResources: 0,
            totalSubjects: 0,
            thisMonth: 0,
        };
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const statCards = [
        { name: 'Total Resources', value: stats.totalResources.toString(), icon: FileText, color: 'text-blue-500' },
        { name: 'Total Users', value: '0', icon: Users, color: 'text-green-500' },
        { name: 'Subjects', value: stats.totalSubjects.toString(), icon: BookOpen, color: 'text-purple-500' },
        { name: 'This Month', value: stats.thisMonth.toString(), icon: TrendingUp, color: 'text-orange-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome to the admin panel</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <Card key={stat.name}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.name}
                            </CardTitle>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/admin/resources">
                            <Button variant="outline" className="w-full">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Manage Resources
                            </Button>
                        </Link>
                        <Link href="/resources">
                            <Button variant="outline" className="w-full">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                View Site
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold">How to add resources:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            <li>Navigate to the <strong>Resources</strong> section on the main site.</li>
                            <li>Select the <strong>Semester</strong> and find the <strong>Subject</strong>.</li>
                            <li>Click the <strong>Add Resource</strong> button on the subject card.</li>
                            <li>Fill in the details (Link, Type, etc.) and submit.</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
