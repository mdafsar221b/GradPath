import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubjectList from "@/components/resources/SubjectList";
import { ArrowLeft, FolderOpen } from "lucide-react";
import Link from "next/link";
import { allSemesters } from "@/data/subjects";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { Resource } from "@/lib/models/Resource";

export const dynamic = 'force-dynamic';

async function getSubjectsForSemester(semesterId: number) {
    try {
        await dbConnect();

        // Get hardcoded subjects as base
        const semesterIndex = semesterId - 1;
        const hardcodedSubjects = (semesterIndex >= 0 && semesterIndex < allSemesters.length)
            ? allSemesters[semesterIndex]
            : [];

        // Fetch resources from MongoDB
        const resources = await Resource.find({ semester: semesterId }).lean();

        if (resources.length === 0) {
            // No database resources, return hardcoded data
            return hardcodedSubjects;
        }

        // Create a map from hardcoded subjects
        const subjectsMap = new Map();

        // Initialize with hardcoded subjects
        hardcodedSubjects.forEach((subject: any) => {
            const resources = [];
            if (subject.notes) {
                resources.push({
                    title: "Study Notes",
                    link: subject.notes,
                    type: 'notes',
                    description: "Legacy Notes"
                });
            }
            if (subject.PYQ) {
                resources.push({
                    title: "Previous Year Questions",
                    link: subject.PYQ,
                    type: 'pyq',
                    description: "Legacy PYQ"
                });
            }

            subjectsMap.set(subject.code, {
                code: subject.code,
                name: subject.name,
                PYQ: subject.PYQ || "",
                notes: subject.notes || "",
                resources: resources
            });
        });

        // Add/merge database resources
        resources.forEach((resource: any) => {
            const key = resource.subjectCode;

            if (!subjectsMap.has(key)) {
                // New subject not in hardcoded data
                subjectsMap.set(key, {
                    code: resource.subjectCode,
                    name: resource.subjectName,
                    PYQ: "",
                    notes: "",
                    resources: []
                });
            }

            const subject = subjectsMap.get(key);

            // Add resource to appropriate category
            const resourceItem = {
                _id: resource._id.toString(),
                title: resource.title,
                link: resource.driveLink,
                description: resource.description,
                year: resource.year,
                type: resource.resourceType === 'video' ? 'youtube' : resource.resourceType // Normalize type
            };

            // Map 'video' fileType to 'youtube' type if needed, or rely on resourceType
            if (resource.resourceType === 'other' && resource.fileType === 'video') {
                resourceItem.type = 'youtube';
            }

            subject.resources.push(resourceItem);
        });

        return Array.from(subjectsMap.values());
    } catch (error) {
        console.error('Error fetching subjects:', error);
        // Fallback to hardcoded data on error
        const semesterIndex = semesterId - 1;
        if (semesterIndex >= 0 && semesterIndex < allSemesters.length) {
            return allSemesters[semesterIndex];
        }
        return [];
    }
}

export default async function SemesterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const semesterId = parseInt(id);

    if (isNaN(semesterId) || semesterId < 1 || semesterId > 6) {
        notFound();
    }

    const subjects = await getSubjectsForSemester(semesterId);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link href="/resources" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-6 transition-colors w-fit">
                        <ArrowLeft size={16} /> Back to Semesters
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                <FolderOpen size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-primary">Semester {id} Subjects</h1>
                                <p className="text-muted-foreground">Select a subject to view available notes and question papers.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {subjects.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No subjects found for this semester.</p>
                        <p className="text-sm text-muted-foreground">Resources will appear here once added by admin.</p>
                    </div>
                ) : (
                    <SubjectList subjects={subjects} semesterId={semesterId} />
                )}
            </main>
            <Footer />
        </div>
    );
}
