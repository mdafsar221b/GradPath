import ResourceForm from "@/components/admin/ResourceForm";

export default function AddResourcePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Add New Resource</h1>
                <p className="text-muted-foreground">Upload a file to Google Drive and add its link here</p>
            </div>

            <ResourceForm mode="add" />
        </div>
    );
}
