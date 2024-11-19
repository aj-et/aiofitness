// app/api/workouts/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userProfile = await prisma.userprofile.findUnique({
      where: { userId }
    });

    if (!userProfile) {
      return new NextResponse('User profile not found', { status: 404 });
    }

    // Fetch recent workouts
    const workouts = await prisma.workoutlog.findMany({
      where: {
        userId: userProfile.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Limit to 20 most recent workouts
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}