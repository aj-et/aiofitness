import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      const body = await req.json();
      const { name, description } = body;
  
      if (!name) {
        return new NextResponse('Name is required', { status: 400 });
      }
  
      const program = await prisma.workoutprogram.create({
        data: {
          name,
          description,
          userId,
        },
      });
  
      return NextResponse.json(program);
    } catch (error) {
      console.error('Error creating workout program:', error);
      return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const workoutPrograms = await prisma.workoutprogram.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(workoutPrograms);
  } catch (error) {
    console.error('[WORKOUT_PROGRAMS_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}