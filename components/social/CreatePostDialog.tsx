// components/social/CreatePostDialog.tsx
'use client';

import { useState } from 'react';
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
import { useRouter } from 'next/navigation';

export default function CreatePostDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [includeWorkout, setIncludeWorkout] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    workout: {
      exercise: '',
      sets: '',
      reps: '',
      weight: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.content,
          workout: includeWorkout ? {
            exercise: formData.workout.exercise,
            sets: parseInt(formData.workout.sets),
            reps: parseInt(formData.workout.reps),
            weight: parseFloat(formData.workout.weight),
          } : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      setFormData({
        content: '',
        workout: {
          exercise: '',
          sets: '',
          reps: '',
          weight: '',
        },
      });
      setIncludeWorkout(false);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setIsLoading(false);
    }
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
                <div className="space-y-2">
                  <label className="text-sm font-medium">Exercise</label>
                  <Input
                    required
                    value={formData.workout.exercise}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      workout: { ...prev.workout, exercise: e.target.value }
                    }))}
                    placeholder="e.g., Bench Press"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sets</label>
                    <Input
                      required
                      type="number"
                      value={formData.workout.sets}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        workout: { ...prev.workout, sets: e.target.value }
                      }))}
                      placeholder="e.g., 3"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reps</label>
                    <Input
                      required
                      type="number"
                      value={formData.workout.reps}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        workout: { ...prev.workout, reps: e.target.value }
                      }))}
                      placeholder="e.g., 10"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Weight (kg)</label>
                    <Input
                      required
                      type="number"
                      step="0.5"
                      value={formData.workout.weight}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        workout: { ...prev.workout, weight: e.target.value }
                      }))}
                      placeholder="e.g., 60"
                      min="0"
                    />
                  </div>
                </div>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}