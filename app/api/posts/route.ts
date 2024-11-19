// app/api/posts/route.ts
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { content, workoutLogId } = body; // Changed from workout to workoutLogId

    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }

    // Find the user profile first
    const userProfile = await prisma.userprofile.findUnique({
      where: { userId }
    });

    if (!userProfile) {
      return new NextResponse('User profile not found', { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        content,
        userId: userProfile.userId,
        workoutLogId: workoutLogId || undefined,
      },
      include: {
        userprofile: true,
        workoutlog: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(req.url);
    const feed = searchParams.get('feed') || 'following';

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find the user profile first
    const userProfile = await prisma.userprofile.findUnique({
      where: { userId }
    });

    if (!userProfile) {
      return new NextResponse('User profile not found', { status: 404 });
    }

    let posts;
    if (feed === 'following') {
      // Get posts from users the current user follows
      const following = await prisma.follow.findMany({
        where: {
          followerId: userProfile.userId,
        },
        select: {
          followingId: true,
        },
      });

      posts = await prisma.post.findMany({
        where: {
          userId: {
            in: [...following.map(f => f.followingId), userProfile.userId],
          },
        },
        include: {
          userprofile: {
            select: {
              firstName: true,
              lastName: true,
              userId: true,
            },
          },
          workoutlog: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: {
            where: {
              userId: userProfile.userId,
            },
            select: {
              id: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      });
    } else {
      // Get trending posts (most likes in the last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      posts = await prisma.post.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        include: {
          userprofile: {
            select: {
              firstName: true,
              lastName: true,
              userId: true,
            },
          },
          workoutlog: true,
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: {
            where: {
              userId: userProfile.userId,
            },
            select: {
              id: true,
            },
          },
        },
        orderBy: [
          {
            likes: {
              _count: 'desc',
            },
          },
          {
            createdAt: 'desc',
          },
        ],
        take: 20,
      });
    }

    // Transform the posts to include hasLiked
    const transformedPosts = posts.map(post => ({
      ...post,
      hasLiked: post.likes.length > 0,
      likes: undefined, // Remove the likes array from the response
      user: {
        id: post.userprofile.userId,
        name: `${post.userprofile.firstName} ${post.userprofile.lastName}`,
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userprofile.firstName}`, // Placeholder avatar
      },
      userprofile: undefined, // Remove the userprofile from the response
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}