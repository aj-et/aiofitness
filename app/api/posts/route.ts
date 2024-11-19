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
    const { content, workoutLogId } = body; // Expect workoutLogId directly

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

    // If workoutLogId is provided, verify it exists and belongs to the user
    if (workoutLogId) {
      const workoutLog = await prisma.workoutlog.findFirst({
        where: {
          id: workoutLogId,
          userId: userProfile.userId,
        },
      });

      if (!workoutLog) {
        return new NextResponse('Workout not found or unauthorized', { status: 404 });
      }
    }

    // Create the post with the workoutLogId
    const post = await prisma.post.create({
      data: {
        content,
        userId: userProfile.userId,
        workoutLogId: workoutLogId || null, // Explicitly set to null if not provided
      },
      include: {
        userprofile: {
          select: {
            firstName: true,
            lastName: true,
            userId: true,
          },
        },
        workoutlog: {
          select: {
            exercise: true,
            sets: true,
            reps: true,
            weight: true,
            notes: true,
          },
        },
      },
    });

    // Transform the response to match the expected format
    const transformedPost = {
      id: post.id,
      content: post.content,
      userId: post.userId,
      workoutlog: post.workoutlog,
      user: {
        id: post.userprofile.userId,
        name: `${post.userprofile.firstName} ${post.userprofile.lastName}`,
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userprofile.firstName}`,
      },
    };

    return NextResponse.json(transformedPost);
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
          workoutlog: {
            select: {
              exercise: true,
              sets: true,
              reps: true,
              weight: true,
              notes: true,
            },
          },
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
          workoutlog: {
            select: {
              exercise: true,
              sets: true,
              reps: true,
              weight: true,
              notes: true,
            },
          },
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

    // Transform the posts to include hasLiked and format user data
    const transformedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      userId: post.userId,
      hasLiked: post.likes.length > 0,
      workoutlog: post.workoutlog, // Include workout data
      _count: post._count,
      user: {
        id: post.userprofile.userId,
        name: `${post.userprofile.firstName} ${post.userprofile.lastName}`,
        imageUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userprofile.firstName}`,
      }
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}