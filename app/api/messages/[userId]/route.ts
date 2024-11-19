// app/api/messages/[userId]/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = await auth();
    const { searchParams } = new URL(req.url);

    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    if (!currentUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userProfile = await prisma.userprofile.findUnique({
      where: { userId: currentUserId },
      select: { userId: true },
    });

    if (!userProfile) {
      return new NextResponse('Profile not found', { status: 404 });
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: params.userId,
        receiverId: userProfile.userId,
        read: false,
      },
      data: { read: true },
    });

    // Get paginated messages
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userProfile.userId,
            receiverId: params.userId,
          },
          {
            senderId: params.userId,
            receiverId: userProfile.userId,
          },
        ],
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      skip: skip,
    });

    // Get total count for pagination
    const totalCount = await prisma.message.count({
      where: {
        OR: [
          {
            senderId: userProfile.userId,
            receiverId: params.userId,
          },
          {
            senderId: params.userId,
            receiverId: userProfile.userId,
          },
        ],
      },
    });

    return NextResponse.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalMessages: totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = await auth();
    const { content } = await req.json();

    if (!currentUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userProfile = await prisma.userprofile.findUnique({
      where: { userId: currentUserId },
      select: { userId: true },
    });

    if (!userProfile) {
      return new NextResponse('Profile not found', { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: userProfile.userId,
        receiverId: params.userId,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}