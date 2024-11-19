// app/api/messages/chats/route.ts
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

    // Get all chats with last message
    const chats = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userProfile.userId },
          { receiverId: userProfile.userId },
        ],
      },
      include: {
        receiver: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
          },
        },
        sender: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      distinct: ['senderId', 'receiverId'],
    });

    // Transform chats to get the other user's info and count unread messages
    const transformedChats = await Promise.all(
      chats.map(async (chat) => {
        const otherUser = chat.senderId === userProfile.userId ? chat.receiver : chat.sender;
        
        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUser.userId,
            receiverId: userProfile.userId,
            read: false,
          },
        });

        return {
          userId: otherUser.userId,
          firstName: otherUser.firstName,
          lastName: otherUser.lastName,
          lastMessage: chat.content,
          timestamp: chat.timestamp,
          unreadCount,
        };
      })
    );

    return NextResponse.json(transformedChats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}