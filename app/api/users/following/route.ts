import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const following = await prisma.follow.findMany({
      where: { followerId: clerkUserId },
      include: {
        following: true,
      },
    });

    const formattedFollowing = following.map((follow) => ({
      userId: follow.following.userId,
      firstName: follow.following.firstName,
      lastName: follow.following.lastName,
      isFollowing: true,
    }));

    return NextResponse.json(formattedFollowing);
  } catch (error) {
    console.error('Error fetching following:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
