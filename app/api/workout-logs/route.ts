import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();

    // Create workout log with updated schema
    const workoutLog = await prisma.workoutlog.create({
      data: {
        userId,
        exercise: data.exercise,
        sets: parseInt(data.sets),
        reps: parseInt(data.reps),
        weight: data.weight ? parseFloat(data.weight) : null,
        muscleGroup: data.muscleGroup || null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(workoutLog);
  } catch (error) {
    console.error('[WORKOUT_LOG_CREATE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}