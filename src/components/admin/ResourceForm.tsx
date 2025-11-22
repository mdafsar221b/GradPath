"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IResource } from "@/lib/models/Resource";
import { allSemesters } from "@/data/subjects";

interface ResourceFormProps {
    resource?: IResource;
    mode: "add" | "edit";
}

export default function ResourceForm({ resource, mode }: ResourceFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [availableSubjects, setAvailableSubjects] = useState<Array<{ code: string; name: string }>>([]);

    const [formData, setFormData] = useState({
        semester: resource?.semester || 1,
        subjectCode: resource?.subjectCode || "",
        subjectName: resource?.subjectName || "",
        resourceType: resource?.resourceType || "notes",
        title: resource?.title || "",
        description: resource?.description || "",
        driveLink: resource?.driveLink || "",
        fileType: resource?.fileType || "pdf",
        year: resource?.year || new Date().getFullYear(),
        tags: resource?.tags?.join(", ") || "",
    });

    // Update available subjects when semester changes
    useEffect(() => {
        const semesterIndex = formData.semester - 1;
        if (semesterIndex >= 0 && semesterIndex < allSemesters.length) {
            const subjects = allSemesters[semesterIndex].map((subject: any) => ({
                code: subject.code,
                name: subject.name,
            }));
            setAvailableSubjects(subjects);

            // Auto-select first subject if current selection is not valid
            const currentSubjectExists = subjects.some((s: any) => s.code === formData.subjectCode);
            if (!currentSubjectExists && subjects.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    subjectCode: subjects[0].code,
                    subjectName: subjects[0].name,
                }));
            }
        }
    }, [formData.semester]);

    const handleSubjectChange = (subjectCode: string) => {
        const subject = availableSubjects.find(s => s.code === subjectCode);
        if (subject) {
            setFormData({
                ...formData,
                subjectCode: subject.code,
                subjectName: subject.name,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
            };

            const url = mode === "add" ? "/api/resources" : `/api/resources/${resource?._id}`;
            const method = mode === "add" ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                router.push("/admin/resources");
                router.refresh();
            } else {
                alert("Failed to save resource");
            }
        } catch (error) {
            console.error("Error saving resource:", error);
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{mode === "add" ? "Add New Resource" : "Edit Resource"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester *</Label>
                            <select
                                id="semester"
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            >
                                {[1, 2, 3, 4, 5, 6].map((sem) => (
                                    <option key={sem} value={sem}>
                                        Semester {sem}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject *</Label>
                            <select
                                id="subject"
                                value={formData.subjectCode}
                                onChange={(e) => handleSubjectChange(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            >
                                {availableSubjects.length === 0 ? (
                                    <option value="">No subjects available</option>
                                ) : (
                                    availableSubjects.map((subject) => (
                                        <option key={subject.code} value={subject.code}>
                                            {subject.code} - {subject.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            <p className="text-xs text-muted-foreground">
                                Subject is auto-selected based on semester
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resourceType">Resource Type *</Label>
                            <select
                                id="resourceType"
                                value={formData.resourceType}
                                onChange={(e) => setFormData({ ...formData, resourceType: e.target.value as any })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            >
                                <option value="notes">Notes</option>
                                <option value="pyq">Previous Year Questions</option>
                                <option value="syllabus">Syllabus</option>
                                <option value="book">Book/Reference</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Unit 1 Notes - Introduction"
                                required
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Optional description..."
                                className="w-full px-3 py-2 border rounded-lg min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="driveLink">Google Drive Link *</Label>
                            <Input
                                id="driveLink"
                                type="url"
                                value={formData.driveLink}
                                onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                                placeholder="https://drive.google.com/file/d/..."
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Make sure the link is set to "Anyone with the link can view"
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fileType">File Type *</Label>
                            <select
                                id="fileType"
                                value={formData.fileType}
                                onChange={(e) => setFormData({ ...formData, fileType: e.target.value as any })}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            >
                                <option value="pdf">PDF</option>
                                <option value="docx">Word Document</option>
                                <option value="pptx">PowerPoint</option>
                                <option value="video">Video</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                placeholder="2024"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                                id="tags"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="important, exam-prep, theory"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : mode === "add" ? "Add Resource" : "Update Resource"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/resources")}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
