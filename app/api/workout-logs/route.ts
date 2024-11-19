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

    const workoutLog = await prisma.workoutlog.create({
      data: {
        userId,
        exercise: data.exercise,
        sets: data.sets,
        reps: data.reps,
        weight: data.weight,
        workoutProgramId: data.workoutProgramId,
        notes: data.notes,
      },
      include: {
        workoutprogram: true,
      },
    });

    return NextResponse.json(workoutLog);
  } catch (error) {
    console.error('[WORKOUT_LOG_CREATE]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const workoutLogs = await prisma.workoutlog.findMany({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        workoutprogram: true,
      },
    });

    return NextResponse.json(workoutLogs);
  } catch (error) {
    console.error('[WORKOUT_LOGS_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}