"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResourceForm from "@/components/admin/ResourceForm";
import { IResource } from "@/lib/models/Resource";

export default function EditResourcePage() {
    const params = useParams();
    const [resource, setResource] = useState<IResource | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResource();
    }, []);

    const fetchResource = async () => {
        try {
            const response = await fetch(`/api/resources/${params.id}`);
            const data = await response.json();

            if (data.success) {
                setResource(data.data);
            }
        } catch (error) {
            console.error("Error fetching resource:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Edit Resource</h1>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">Resource Not Found</h1>
                <p className="text-muted-foreground">The resource you're looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Edit Resource</h1>
                <p className="text-muted-foreground">Update resource information</p>
            </div>

            <ResourceForm mode="edit" resource={resource} />
        </div>
    );
}
