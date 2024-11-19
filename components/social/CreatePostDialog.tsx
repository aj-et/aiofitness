// components/social/CreatePostDialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from 'next/navigation';

interface Workout {
  id: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number | null;
  createdAt: string;
}

export default function CreatePostDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [includeWorkout, setIncludeWorkout] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>('');
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(false);
  
  const [formData, setFormData] = useState({
    content: '',
  });

  useEffect(() => {
    if (includeWorkout) {
      fetchWorkouts();
    }
  }, [includeWorkout]);

  const fetchWorkouts = async () => {
    setIsLoadingWorkouts(true);
    try {
      const response = await fetch('/api/workouts');
      if (!response.ok) throw new Error('Failed to fetch workouts');
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setIsLoadingWorkouts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // Add some debug logging
      console.log('Submitting post with data:', {
        content: formData.content,
        workoutLogId: includeWorkout ? selectedWorkoutId : undefined,
      });
  
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.content,
          workoutLogId: includeWorkout ? selectedWorkoutId : undefined,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create post');
      }
  
      const data = await response.json();
      console.log('Post created successfully:', data);
  
      setFormData({ content: '' });
      setIncludeWorkout(false);
      setSelectedWorkoutId('');
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
      alert(error instanceof Error ? error.message : 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const formatWorkoutDisplay = (workout: Workout) => {
    const date = new Date(workout.createdAt).toLocaleDateString();
    return `${workout.exercise} - ${workout.sets}×${workout.reps} ${workout.weight}kg (${date})`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>
              Share your workout progress with your followers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">What's on your mind?</label>
              <Textarea
                required
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="include-workout"
                checked={includeWorkout}
                onCheckedChange={setIncludeWorkout}
              />
              <Label htmlFor="include-workout">Include workout details</Label>
            </div>

            {includeWorkout && (
              <div className="space-y-4">
                {isLoadingWorkouts ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : workouts.length > 0 ? (
                  <>
                    <Select
                      value={selectedWorkoutId}
                      onValueChange={(value) => {
                        console.log('Selected workout ID:', value);
                        setSelectedWorkoutId(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a workout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Recent Workouts</SelectLabel>
                          {workouts.map((workout) => (
                            <SelectItem 
                              key={workout.id} 
                              value={workout.id}
                            >
                              {formatWorkoutDisplay(workout)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {/* Debug display */}
                    <div className="text-xs text-gray-500">
                      Selected workout ID: {selectedWorkoutId || 'none'}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    No workouts found. Add some workouts first!
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || (includeWorkout && !selectedWorkoutId)}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}