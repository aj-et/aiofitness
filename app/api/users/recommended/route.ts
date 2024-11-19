// app/api/users/recommended/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userProfile = await prisma.userprofile.findUnique({
      where: { userId },
      select: { userId: true },
    });

    if (!userProfile) {
      return new NextResponse('Profile not found', { status: 404 });
    }

    // Get users that the current user is following
    const following = await prisma.follow.findMany({
      where: { followerId: userProfile.userId },
      select: { followingId: true },
    });
    const followingIds = following.map(f => f.followingId);

    // Get recommended users (not followed by current user)
    const recommendedUsers = await prisma.userprofile.findMany({
      where: {
        userId: {
          not: userProfile.userId,
          notIn: followingIds,
        },
      },
      take: 5,
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        followers: {
          where: {
            followerId: {
              in: followingIds,
            },
          },
        },
      },
    });

    const transformedUsers = recommendedUsers.map(user => ({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      mutualFollowers: user.followers.length,
      isFollowing: false,
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching recommended users:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}