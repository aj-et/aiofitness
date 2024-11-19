'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MoreVertical, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Workout {
  exercise: string;
  sets: number;
  reps: number;
  weight: number | null;
  notes?: string | null;
}

interface Post {
  id: string;
  content: string;
  userId: string;
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  workoutlog?: Workout;
  _count: {
    likes: number;
    comments: number;
  };
  hasLiked: boolean;
  createdAt: string;
}

function formatTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function WorkoutFeed({ type }: { type: 'following' | 'trending' }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, [type]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/posts?feed=${type}`);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => fetchPosts()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {type === 'following'
            ? 'No posts yet. Follow some users or create your first post!'
            : 'No trending posts found. Be the first to create a trending post!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.user.imageUrl} alt={post.user.name} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{post.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatTimeAgo(post.createdAt)}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Report</DropdownMenuItem>
                  <DropdownMenuItem>Copy Link</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-gray-900 mb-4">{post.content}</p>

            {post.workoutlog && (
              <Card className="bg-gray-50 mb-4">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Exercise</p>
                      <p className="font-medium">{post.workoutlog.exercise}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">
                        {post.workoutlog.weight ? `${post.workoutlog.weight}kg` : 'No weight'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sets</p>
                      <p className="font-medium">{post.workoutlog.sets}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Reps</p>
                      <p className="font-medium">{post.workoutlog.reps}</p>
                    </div>
                    {post.workoutlog.notes && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="font-medium">{post.workoutlog.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`text-gray-600 ${post.hasLiked ? 'text-red-500 hover:text-red-600' : ''}`}
                disabled={likingPosts.has(post.id)}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${post.hasLiked ? 'fill-current' : ''}`}
                />
                {post._count.likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <MessageCircle className="h-4 w-4 mr-2" />
                {post._count.comments}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}