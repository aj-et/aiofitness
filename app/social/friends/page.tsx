// app/social/friends/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UserX, 
  UserMinus, 
  UserPlus, 
  Search, 
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface User {
  userId: string;
  firstName: string;
  lastName: string;
  mutualFriends?: number;
  isFollowing: boolean;
}

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('followers');
  const [searchQuery, setSearchQuery] = useState('');
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${activeTab}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch ${activeTab}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (activeTab === 'followers') {
        setFollowers(data);
      } else {
        setFollowing(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Set empty array to prevent UI from breaking
      activeTab === 'followers' ? setFollowers([]) : setFollowing([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFollow = async (userId: string) => {
    setProcessingIds(prev => new Set(prev).add(userId));
    try {
      const isCurrentlyFollowing = following.some(f => f.userId === userId);
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
      
      const response = await fetch('/api/users/follow', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update follow status: ${errorText}`);
      }
      
      // Refresh users after successful follow/unfollow
      await fetchUsers();
    } catch (error) {
      console.error('Error updating follow status:', error);
      // Optional: Add user-friendly error toast/notification
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const filteredUsers = (activeTab === 'followers' ? followers : following)
    .filter(user => 
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
        <p className="text-gray-600">Manage your connections</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="followers" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <Card>
              <CardContent className="divide-y">
                {filteredUsers.map((user) => (
                  <div key={user.userId} className="py-4 first:pt-6 last:pb-6">
                    <UserListItem
                      user={user}
                      onFollow={handleFollow}
                      isProcessing={processingIds.has(user.userId)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No users found' : 'No followers yet'}
            </div>
          )}
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <Card>
              <CardContent className="divide-y">
                {filteredUsers.map((user) => (
                  <div key={user.userId} className="py-4 first:pt-6 last:pb-6">
                    <UserListItem
                      user={user}
                      onFollow={handleFollow}
                      isProcessing={processingIds.has(user.userId)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No users found' : 'Not following anyone yet'}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserListItem({ 
  user, 
  onFollow, 
  isProcessing 
}: { 
  user: User; 
  onFollow: (userId: string) => Promise<void>; 
  isProcessing: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
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
          {user.mutualFriends !== undefined && (
            <p className="text-sm text-gray-500">
              {user.mutualFriends} mutual friends
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant={user.isFollowing ? "secondary" : "outline"}
          size="sm"
          onClick={() => onFollow(user.userId)}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : user.isFollowing ? (
            <UserMinus className="h-4 w-4" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}