'use server';

import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { Resource } from '@/lib/models/Resource';
import { revalidatePath } from 'next/cache';

export async function getYouTubeMetadata(url: string) {
    try {
        const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.error) {
            return { error: 'Invalid YouTube URL' };
        }

        return {
            title: data.title,
            thumbnail: data.thumbnail_url,
            author: data.author_name
        };
    } catch (error) {
        console.error('Error fetching YouTube metadata:', error);
        return { error: 'Failed to fetch metadata' };
    }
}

export async function addResource(formData: any) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await dbConnect();

        const resource = await Resource.create({
            ...formData,
            uploadedBy: userId,
            uploadedAt: new Date(),
        });

        revalidatePath('/resources');
        revalidatePath(`/resources/semester/${formData.semester}`);

        return { success: true, data: JSON.parse(JSON.stringify(resource)) };
    } catch (error: any) {
        console.error('Error adding resource:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteResource(resourceId: string, semester: number) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        await dbConnect();

        // Optional: Check if the user is the one who uploaded it or is an admin
        // For now, assuming any authenticated user can delete (or restrict as needed)
        // const resource = await Resource.findById(resourceId);
        // if (resource.uploadedBy !== userId) return { success: false, error: 'Forbidden' };

        await Resource.findByIdAndDelete(resourceId);

        revalidatePath('/resources');
        revalidatePath(`/resources/semester/${semester}`);

        return { success: true };
    } catch (error: any) {
        console.error('Error deleting resource:', error);
        return { success: false, error: error.message };
    }
}
