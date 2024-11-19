// app/social/page.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreatePostDialog from '@/components/social/CreatePostDialog';
import WorkoutFeed from '@/components/social/WorkoutFeed';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Dumbbell, Home, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
 {
   href: '/',
   icon: Home,
   label: 'Dashboard',
 },
 {
   href: '/social',
   icon: Users,
   label: 'Social',
 },
 {
   href: '/workouts',
   icon: Dumbbell,
   label: 'Workouts',
 },
];

export default function SocialPage() {
 const [activeTab, setActiveTab] = useState('following');

 return (
   <div className="flex min-h-screen">
     {/* Sidebar */}
     <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
       <div className="mb-8">
         <h1 className="text-2xl font-bold flex items-center gap-2">
           <Dumbbell className="h-6 w-6" />
           Workout App
         </h1>
       </div>

       <nav className="space-y-2 flex-1">
         {navItems.map((item) => {
           const Icon = item.icon;
           return (
             <Link key={item.href} href={item.href}>
               <Button
                 variant="ghost"
                 className={cn(
                   'w-full justify-start',
                   item.href === '/social' && 'bg-gray-100'
                 )}
               >
                 <Icon className="mr-2 h-5 w-5" />
                 {item.label}
               </Button>
             </Link>
           );
         })}
       </nav>

       <div className="pt-4 border-t">
         <UserButton afterSignOutUrl="/" />
       </div>
     </div>

     {/* Main content */}
     <main className="flex-1 bg-gray-50">
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

     {/* Right sidebar - could be used for suggested users, trending topics, etc. */}
     <div className="hidden lg:block w-64 bg-white border-l border-gray-200 p-4">
       <h2 className="font-semibold mb-4">Suggested Users</h2>
       <div className="space-y-4">
         {/* Placeholder for suggested users */}
         <div className="animate-pulse">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-gray-200 rounded-full" />
             <div className="flex-1">
               <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
               <div className="h-3 bg-gray-200 rounded w-32" />
             </div>
           </div>
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-gray-200 rounded-full" />
             <div className="flex-1">
               <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
               <div className="h-3 bg-gray-200 rounded w-24" />
             </div>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gray-200 rounded-full" />
             <div className="flex-1">
               <div className="h-4 bg-gray-200 rounded w-28 mb-2" />
               <div className="h-3 bg-gray-200 rounded w-20" />
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}