import mongoose, { Schema, model, models } from 'mongoose';

export interface IResource {
    _id?: string;
    semester: number;
    subjectCode: string;
    subjectName: string;
    resourceType: 'notes' | 'pyq' | 'syllabus' | 'book' | 'other';
    title: string;
    description?: string;
    driveLink: string;
    fileType: 'pdf' | 'docx' | 'pptx' | 'video' | 'other';
    uploadedBy: string;
    uploadedAt: Date;
    year?: number;
    tags?: string[];
}

const ResourceSchema = new Schema<IResource>(
    {
        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 6,
        },
        subjectCode: {
            type: String,
            required: true,
        },
        subjectName: {
            type: String,
            required: true,
        },
        resourceType: {
            type: String,
            required: true,
            enum: ['notes', 'pyq', 'syllabus', 'book', 'other'],
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        driveLink: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
            enum: ['pdf', 'docx', 'pptx', 'video', 'other'],
        },
        uploadedBy: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for better query performance
ResourceSchema.index({ semester: 1, subjectCode: 1 });
ResourceSchema.index({ resourceType: 1 });

export const Resource = models.Resource || model<IResource>('Resource', ResourceSchema);
