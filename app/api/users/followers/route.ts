import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: clerkUserId },
      include: {
        follower: true,
      },
    });

    const formattedFollowers = followers.map((follow) => ({
      userId: follow.follower.userId,
      firstName: follow.follower.firstName,
      lastName: follow.follower.lastName,
      isFollowing: true, // Assuming they are all followers
    }));

    return NextResponse.json(formattedFollowers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
