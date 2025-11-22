"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Edit, Trash2, ExternalLink, Plus } from "lucide-react";
import { IResource } from "@/lib/models/Resource";

export default function ResourcesPage() {
    const [resources, setResources] = useState<IResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ semester: "", resourceType: "" });

    useEffect(() => {
        fetchResources();
    }, [filter]);

    const fetchResources = async () => {
        try {
            const params = new URLSearchParams();
            if (filter.semester) params.append("semester", filter.semester);
            if (filter.resourceType) params.append("resourceType", filter.resourceType);

            const response = await fetch(`/api/resources?${params}`);
            const data = await response.json();

            if (data.success) {
                setResources(data.data);
            }
        } catch (error) {
            console.error("Error fetching resources:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteResource = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;

        try {
            const response = await fetch(`/api/resources/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchResources();
            } else {
                alert("Failed to delete resource");
            }
        } catch (error) {
            console.error("Error deleting resource:", error);
        }
    };

    const getResourceTypeColor = (type: string) => {
        switch (type) {
            case "notes":
                return "bg-blue-500";
            case "pyq":
                return "bg-purple-500";
            case "syllabus":
                return "bg-green-500";
            case "book":
                return "bg-orange-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Resources</h1>
                    <p className="text-muted-foreground">View, edit, and delete resources</p>
                </div>
                <Link href="/admin/resources/add">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Resource
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <select
                            value={filter.semester}
                            onChange={(e) => setFilter({ ...filter, semester: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                        >
                            <option value="">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6].map((sem) => (
                                <option key={sem} value={sem}>
                                    Semester {sem}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filter.resourceType}
                            onChange={(e) => setFilter({ ...filter, resourceType: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                        >
                            <option value="">All Types</option>
                            <option value="notes">Notes</option>
                            <option value="pyq">PYQ</option>
                            <option value="syllabus">Syllabus</option>
                            <option value="book">Book</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Loading resources...</p>
                    </CardContent>
                </Card>
            ) : resources.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground mb-4">No resources found</p>
                        <Link href="/admin/resources/add">
                            <Button>Add Your First Resource</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {resources.map((resource) => (
                        <Card key={resource._id}>
                            <CardContent className="py-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold text-lg">{resource.title}</h3>
                                            <Badge className={getResourceTypeColor(resource.resourceType)}>
                                                {resource.resourceType}
                                            </Badge>
                                            <Badge variant="outline">Sem {resource.semester}</Badge>
                                            <Badge variant="outline">{resource.fileType.toUpperCase()}</Badge>
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            {resource.subjectCode} - {resource.subjectName}
                                        </p>

                                        {resource.description && (
                                            <p className="text-sm">{resource.description}</p>
                                        )}

                                        {resource.tags && resource.tags.length > 0 && (
                                            <div className="flex gap-1 flex-wrap">
                                                {resource.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <a
                                            href={resource.driveLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <Link
                                            href={`/admin/resources/edit/${resource._id}`}
                                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => deleteResource(resource._id!)}
                                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
