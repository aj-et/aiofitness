import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const { programId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, description, exercises } = body;

    // Get existing exercises to determine which ones to delete
    const existingProgram = await prisma.workoutprogram.findUnique({
      where: { id: programId },
      include: { exercises: true },
    });

    if (!existingProgram) {
      return new NextResponse('Program not found', { status: 404 });
    }

    // Identify exercises to delete (those in existing but not in updated list)
    const updatedExerciseIds = exercises
      .filter((e: any) => e.id && !e.id.startsWith('temp-'))
      .map((e: any) => e.id);
    const exercisesToDelete = existingProgram.exercises
      .filter(e => !updatedExerciseIds.includes(e.id))
      .map(e => e.id);

    // Update program with transaction to handle all changes atomically
    const updatedProgram = await prisma.$transaction(async (tx) => {
      // Delete removed exercises
      if (exercisesToDelete.length > 0) {
        await tx.programexercise.deleteMany({
          where: {
            id: { in: exercisesToDelete },
            workoutProgramId: programId,
          },
        });
      }

      // Update program and handle exercises
      return await tx.workoutprogram.update({
        where: {
          id: programId,
          userId,
        },
        data: {
          name,
          description,
          exercises: {
            // Update existing exercises
            updateMany: exercises
              .filter((e: any) => e.id && !e.id.startsWith('temp-'))
              .map((exercise: any) => ({
                where: { id: exercise.id },
                data: {
                  sets: exercise.sets,
                  reps: exercise.reps,
                  notes: exercise.notes,
                  order: exercise.order,
                },
              })),
            // Create new exercises
            create: exercises
              .filter((e: any) => !e.id || e.id.startsWith('temp-'))
              .map((exercise: any) => ({
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
          exercises: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    });

    return NextResponse.json(updatedProgram);
  } catch (error) {
    console.error('Error updating workout program:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { programId: string } }
) {
  try {
    const { programId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.workoutprogram.delete({
      where: {
        id: programId,
        userId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting workout program:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}