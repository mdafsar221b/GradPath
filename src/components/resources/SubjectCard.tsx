"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, Download, AlertCircle, Youtube, ExternalLink, Trash2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Subject } from "@/data/subjects";
import Link from "next/link";
import AddResourceForm from "./AddResourceForm";
import { deleteResource } from "@/app/actions/resources";
import { toast } from "sonner";

export default function SubjectCard({ subject, semesterId }: { subject: Subject, semesterId: number }) {
    const [isOpen, setIsOpen] = useState(false);

    // Normalize resources
    const resources = subject.resources || [];

    // Add legacy hardcoded resources if they exist and aren't already in the list
    if (subject.notes && typeof subject.notes === 'string' && subject.notes.length > 0 && !resources.some(r => r.link === subject.notes)) {
        resources.push({ title: "Study Notes", link: subject.notes, type: 'notes' });
    }
    if (subject.PYQ && typeof subject.PYQ === 'string' && subject.PYQ.length > 0 && !resources.some(r => r.link === subject.PYQ)) {
        resources.push({ title: "Previous Year Questions", link: subject.PYQ, type: 'pyq' });
    }

    const hasResources = resources.length > 0;

    const notes = resources.filter(r => r.type === 'notes');
    const pyqs = resources.filter(r => r.type === 'pyq');
    const videos = resources.filter(r => r.type === 'youtube' || r.type === 'other' && !r.link.includes('drive.google.com')); // Basic heuristic
    const links = resources.filter(r => r.type === 'link');

    const handleDelete = async (resourceId?: string) => {
        if (!resourceId) return;
        if (!confirm("Are you sure you want to delete this resource?")) return;

        const result = await deleteResource(resourceId, semesterId);
        if (result.success) {
            toast.success("Resource deleted");
        } else {
            toast.error("Failed to delete resource");
        }
    };

    const ResourceItem = ({ item, icon: Icon, colorClass }: { item: any, icon: any, colorClass: string }) => (
        <div className="flex items-center justify-between p-3 rounded-lg bg-background border hover:border-primary/30 transition-all group">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-2 ${colorClass} rounded-lg flex-shrink-0`}>
                    <Icon size={18} />
                </div>
                <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {item.description || (item.year ? `Year: ${item.year}` : "Resource")}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Link href={item.link} target="_blank">
                        <ExternalLink size={16} />
                    </Link>
                </Button>
                {item._id && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(item._id)}
                    >
                        <Trash2 size={16} />
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="border rounded-xl bg-card overflow-hidden mb-4 transition-all hover:border-primary/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-secondary/30 transition-colors text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                        {subject.name.trim().charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-foreground">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!hasResources && (
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md hidden sm:inline-block">
                            Add Resources
                        </span>
                    )}
                    <ChevronDown
                        className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="p-6 pt-0 space-y-6 border-t border-border/50 bg-secondary/5">

                            {/* Action Bar */}
                            <div className="flex justify-end pt-4">
                                <AddResourceForm semester={semesterId} subjectCode={subject.code} subjectName={subject.name} />
                            </div>

                            {hasResources ? (
                                <div className="space-y-6">
                                    {/* Notes Section */}
                                    {notes.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Study Material</h4>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {notes.map((note, idx) => (
                                                    <ResourceItem key={idx} item={note} icon={FileText} colorClass="bg-emerald-50 text-emerald-600" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* PYQ Section */}
                                    {pyqs.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Previous Year Questions</h4>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {pyqs.map((pyq, idx) => (
                                                    <ResourceItem key={idx} item={pyq} icon={Download} colorClass="bg-blue-50 text-blue-600" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Videos Section */}
                                    {videos.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Video Tutorials</h4>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {videos.map((video, idx) => (
                                                    <ResourceItem key={idx} item={video} icon={Youtube} colorClass="bg-red-50 text-red-600" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Important Links Section */}
                                    {links.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Important Links</h4>
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {links.map((link, idx) => (
                                                    <ResourceItem key={idx} item={link} icon={LinkIcon} colorClass="bg-purple-50 text-purple-600" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                    <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                                    <p>No resources available yet.</p>
                                    <p className="text-xs mt-1">Be the first to add one!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
