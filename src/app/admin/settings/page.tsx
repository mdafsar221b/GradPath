import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your admin preferences</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Admin Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium">Admin Email</p>
                        <p className="text-sm text-muted-foreground">{process.env.ADMIN_EMAIL}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Database</p>
                        <p className="text-sm text-muted-foreground">MongoDB Connected</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Environment Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <p>Make sure you have created a <code className="bg-muted px-1 py-0.5 rounded">.env.local</code> file with:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                        <li>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
                        <li>CLERK_SECRET_KEY</li>
                        <li>MONGODB_URI</li>
                        <li>ADMIN_EMAIL</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
