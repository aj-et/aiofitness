import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: {
    postId: string;
  };
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const postId = params.postId;

  if (!postId) {
    return new NextResponse('Post ID is required', { status: 400 });
  }

  try {
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
  request: NextRequest,
  { params }: RouteContext
) {
  const postId = params.postId;

  if (!postId) {
    return new NextResponse('Post ID is required', { status: 400 });
  }

  try {
    const { userId } = await auth();
    const { content } = await request.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }

    const userProfile = await prisma.userprofile.findUnique({
      where: { userId }
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
        userprofile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
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