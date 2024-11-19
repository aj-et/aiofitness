import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Context {
  params: {
    postId: string;
  };
}

export async function GET(
  req: Request,
  context: Context
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
    });

    return NextResponse.json(comments);
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
    const { postId } = context.params;
    const { content } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}