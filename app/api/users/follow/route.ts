// app/api/users/follow/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    const { userId: targetUserId } = await req.json();

    if (!clerkUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const follower = await prisma.userprofile.findUnique({
      where: { userId: clerkUserId },
    });

    if (!follower) {
      return new NextResponse('Profile not found', { status: 404 });
    }

    const follow = await prisma.follow.create({
      data: {
        followerId: follower.userId,
        followingId: targetUserId,
      },
    });

    return NextResponse.json(follow);
  } catch (error) {
    console.error('Error following user:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    const { userId: targetUserId } = await req.json();

    if (!clerkUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const follower = await prisma.userprofile.findUnique({
      where: { userId: clerkUserId },
    });

    if (!follower) {
      return new NextResponse('Profile not found', { status: 404 });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: follower.userId,
          followingId: targetUserId,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}