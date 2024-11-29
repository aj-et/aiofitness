// app/api/workout-programs/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const visibility = searchParams.get('visibility');

    if (visibility === 'public') {
      // Get all public programs except user's own
      const programs = await prisma.workoutprogram.findMany({
        where: {
          isPublic: true,
          NOT: {
            userId: userId || undefined,
          },
        },
        include: {
          exercises: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(programs);
    } else {
      // Get user's programs
      if (!userId) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        );
      }

      const programs = await prisma.workoutprogram.findMany({
        where: {
          userId,
        },
        include: {
          exercises: {
            orderBy: {
              order: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(programs);
    }
  } catch (error) {
    console.error('Error fetching workout programs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, exercises, isPublic = false } = body;

    const program = await prisma.workoutprogram.create({
      data: {
        name,
        description,
        userId,
        isPublic,
        exercises: {
          create: exercises.map((exercise: any) => ({
            exerciseName: exercise.exerciseName,
            sets: exercise.sets,
            reps: exercise.reps,
            notes: exercise.notes,
            order: exercise.order,
            muscleGroup: exercise.muscleGroup,
          })),
        },
      },
      include: {
        exercises: true,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error creating workout program:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}