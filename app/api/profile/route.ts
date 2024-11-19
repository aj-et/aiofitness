import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();

    // Find user profile first
    const existingProfile = await prisma.userprofile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      // Create new profile if it doesn't exist
      const newProfile = await prisma.userprofile.create({
        data: {
          userId,
          firstName: data.firstName,
          lastName: data.lastName,
          age: data.age ? parseInt(data.age) : null,
          weight: data.weight ? parseFloat(data.weight) : null,
          height: data.height ? parseFloat(data.height) : null,
          fitnessGoal: data.fitnessGoal,
          activityLevel: data.activityLevel,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json(newProfile);
    }

    // Update existing profile
    const updatedProfile = await prisma.userprofile.update({
      where: { userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age ? parseInt(data.age) : null,
        weight: data.weight ? parseFloat(data.weight) : null,
        height: data.height ? parseFloat(data.height) : null,
        fitnessGoal: data.fitnessGoal || null,
        activityLevel: data.activityLevel || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('[PROFILE_UPDATE]', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
}