"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Youtube, FileText, Download, Link as LinkIcon } from "lucide-react";
import { getYouTubeMetadata, addResource } from "@/app/actions/resources";
import { toast } from "sonner";

interface AddResourceFormProps {
    semester: number;
    subjectCode: string;
    subjectName: string;
}

export default function AddResourceForm({ semester, subjectCode, subjectName }: AddResourceFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resourceType, setResourceType] = useState<string>("notes");
    const [formData, setFormData] = useState({
        title: "",
        driveLink: "",
        year: new Date().getFullYear(),
        description: "",
    });

    const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, driveLink: url }));

        if (resourceType === "youtube" && (url.includes("youtube.com") || url.includes("youtu.be"))) {
            setLoading(true);
            const metadata = await getYouTubeMetadata(url);
            setLoading(false);

            if (metadata && !metadata.error) {
                setFormData(prev => ({
                    ...prev,
                    title: metadata.title,
                    description: `Channel: ${metadata.author}`
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await addResource({
                semester,
                subjectCode,
                subjectName,
                resourceType,
                title: formData.title,
                driveLink: formData.driveLink,
                year: resourceType === 'pyq' ? formData.year : undefined,
                description: formData.description,
                fileType: resourceType === 'youtube' ? 'video' : 'pdf', // Default to pdf for others for now
            });

            if (result.success) {
                toast.success("Resource added successfully!");
                setOpen(false);
                setFormData({
                    title: "",
                    driveLink: "",
                    year: new Date().getFullYear(),
                    description: "",
                });
            } else {
                toast.error(result.error || "Failed to add resource");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus size={16} /> Add Resource
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Resource</DialogTitle>
                    <DialogDescription>
                        Add a new resource for {subjectName}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Resource Type</Label>
                        <Select value={resourceType} onValueChange={setResourceType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="notes">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} /> Notes
                                    </div>
                                </SelectItem>
                                <SelectItem value="pyq">
                                    <div className="flex items-center gap-2">
                                        <Download size={16} /> Previous Year Question
                                    </div>
                                </SelectItem>
                                <SelectItem value="youtube">
                                    <div className="flex items-center gap-2">
                                        <Youtube size={16} /> YouTube Video
                                    </div>
                                </SelectItem>
                                <SelectItem value="link">
                                    <div className="flex items-center gap-2">
                                        <LinkIcon size={16} /> Important Link
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Link {resourceType === 'youtube' ? '(YouTube URL)' : '(URL)'}</Label>
                        <Input
                            required
                            placeholder={resourceType === 'youtube' ? "https://youtube.com/..." : "https://..."}
                            value={formData.driveLink}
                            onChange={handleUrlChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            required
                            placeholder="Resource Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Input
                            placeholder="Brief description..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {resourceType === 'pyq' && (
                        <div className="space-y-2">
                            <Label>Year</Label>
                            <Input
                                type="number"
                                required
                                placeholder="2024"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            />
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Resource
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
