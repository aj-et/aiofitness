// app/api/posts/[postId]/comments/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: {
    postId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function GET(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const { postId } = context.params;
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc',
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

    // Transform comments to include user information
    const transformedComments = comments.map(comment => ({
      ...comment,
      user: {
        name: `${comment.userprofile.firstName} ${comment.userprofile.lastName}`,
      },
      userprofile: undefined,
    }));

    return NextResponse.json(transformedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const { userId } = await auth();
    const { postId } = context.params;
    const { content } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find user profile
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

    // Transform the comment to include user information
    const transformedComment = {
      ...comment,
      user: {
        name: `${comment.userprofile.firstName} ${comment.userprofile.lastName}`,
      },
      userprofile: undefined,
    };

    return NextResponse.json(transformedComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}