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

    const foodEntry = await prisma.foodentry.create({
      data: {
        userId,
        name: data.name,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
      },
    });

    return NextResponse.json(foodEntry);
  } catch (error) {
    console.error('[FOOD_ENTRY_CREATE]', error);
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
    
    const foodEntries = await prisma.foodentry.findMany({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(foodEntries);
  } catch (error) {
    console.error('[FOOD_ENTRIES_GET]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}