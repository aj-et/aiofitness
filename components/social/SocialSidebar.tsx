// components/social/SocialSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserPlus,
  Loader2,
  UserCheck,
  User,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing?: boolean;
}

interface RecommendedUser {
  userId: string;
  firstName: string;
  lastName: string;
  mutualFollowers: number;
  isFollowing: boolean;
}

export default function SocialSidebar() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const [isProcessingFollow, setIsProcessingFollow] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProfile();
    fetchRecommendedUsers();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchRecommendedUsers = async () => {
    try {
      const response = await fetch('/api/users/recommended');
      if (!response.ok) throw new Error('Failed to fetch recommended users');
      const data = await response.json();
      setRecommendedUsers(data);
      // Initialize following states
      const followStates: Record<string, boolean> = {};
      data.forEach((user: RecommendedUser) => {
        followStates[user.userId] = user.isFollowing;
      });
      setFollowingStates(followStates);
    } catch (error) {
      console.error('Error fetching recommended users:', error);
    } finally {
      setIsLoadingRecommended(false);
    }
  };

  const handleFollow = async (userId: string) => {
    setIsProcessingFollow(prev => ({ ...prev, [userId]: true }));
    try {
      const method = followingStates[userId] ? 'DELETE' : 'POST';
      const response = await fetch('/api/users/follow', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to update follow status');

      setFollowingStates(prev => ({
        ...prev,
        [userId]: !prev[userId],
      }));

      // Update profile followers count if needed
      if (profile) {
        setProfile(prev => {
          if (!prev) return prev;
          const change = method === 'POST' ? 1 : -1;
          return {
            ...prev,
            _count: {
              ...prev._count,
              following: prev._count.following + change,
            },
          };
        });
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    } finally {
      setIsProcessingFollow(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      {profile && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`} 
                  alt={`${profile.firstName} ${profile.lastName}`} 
                />
                <AvatarFallback>{profile.firstName[0]}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">
                {profile.firstName} {profile.lastName}
              </h3>
              {profile.bio && (
                <p className="text-sm text-gray-500 mt-1">{profile.bio}</p>
              )}
              
              <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {profile._count.followers}
                  </div>
                  <div>Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {profile._count.following}
                  </div>
                  <div>Following</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">
                    {profile._count.posts}
                  </div>
                  <div>Posts</div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/social/friends">
                    <Users className="h-4 w-4 mr-2" />
                    Friends
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Users */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recommended Users</h3>
          </div>

          {isLoadingRecommended ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : recommendedUsers.length > 0 ? (
            <div className="space-y-4">
              {recommendedUsers.map((user) => (
                <div key={user.userId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback>{user.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user.mutualFollowers} mutual followers
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={followingStates[user.userId] ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleFollow(user.userId)}
                    disabled={isProcessingFollow[user.userId]}
                  >
                    {isProcessingFollow[user.userId] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : followingStates[user.userId] ? (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No recommended users at the moment
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}