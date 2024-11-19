import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Context {
  params: Promise<{ postId: string }> | { postId: string };
}

export async function GET(
  req: Request,
  context: Context
) {
  try {
    const { postId } = await context.params;
    
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        userprofile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        name: `${comment.userprofile.firstName} ${comment.userprofile.lastName}`,
      },
    }));

    return NextResponse.json(transformedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: Context
) {
  try {
    const { userId } = await auth();
    const { postId } = await context.params;
    const { content } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userProfile = await prisma.userprofile.findUnique({
      where: { userId },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!userProfile) {
      return new NextResponse('User profile not found', { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: userProfile.userId,
      },
      include: {
        userprofile: true,
      },
    });

    const transformedComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: {
        name: `${comment.userprofile.firstName} ${comment.userprofile.lastName}`,
      },
    };

    return NextResponse.json(transformedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}