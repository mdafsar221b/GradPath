import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import { Resource } from '@/lib/models/Resource';

// GET all resources or filter by semester/subject
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const semester = searchParams.get('semester');
        const subjectCode = searchParams.get('subjectCode');
        const resourceType = searchParams.get('resourceType');

        let query: any = {};

        if (semester) query.semester = parseInt(semester);
        if (subjectCode) query.subjectCode = subjectCode;
        if (resourceType) query.resourceType = resourceType;

        const resources = await Resource.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: resources });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Create new resource (Admin only)
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const body = await request.json();
        const resource = await Resource.create({
            ...body,
            uploadedBy: userId,
            uploadedAt: new Date(),
        });

        return NextResponse.json({ success: true, data: resource }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
