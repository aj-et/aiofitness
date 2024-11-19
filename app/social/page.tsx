// app/social/page.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreatePostDialog from '@/components/social/CreatePostDialog';
import WorkoutFeed from '@/components/social/WorkoutFeed';
import SocialSidebar from '@/components/social/SocialSidebar';
import { motion } from 'framer-motion';

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('following');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Social Feed</h1>
              <p className="text-gray-600">See what others are working on</p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            >
              <CreatePostDialog />
            </motion.div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>

            <TabsContent value="following" className="space-y-4">
              <WorkoutFeed type="following" />
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <WorkoutFeed type="trending" />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Right sidebar */}
      <aside className="hidden lg:block w-80 flex-shrink-0 p-4 border-l border-gray-200 bg-white">
        <div className="sticky top-4">
          <SocialSidebar />
        </div>
      </aside>
    </div>
  );
}