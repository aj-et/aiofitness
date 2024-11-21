// components/forms/AddWorkoutLog.tsx
'use client';

import { useState } from 'react';
import { Exercise } from '@/types/exercise';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import ExerciseSearch from '../ExerciseSearch';
import { useRouter } from 'next/navigation';
import { muscleGroups } from '@/types/exercise';

interface FormData {
  exercise: string;
  sets: number;
  reps: number;
  weight?: number;
  muscleGroup: string;
  notes?: string;
}

export default function AddWorkoutLog() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    exercise: '',
    sets: 1,
    reps: 1,
    muscleGroup: '',
    weight: undefined,
    notes: '',
  });

  const handleExerciseSelect = (exercise: Exercise) => {
    setFormData(prev => ({
      ...prev,
      exercise: exercise.name,
      muscleGroup: exercise.muscle,
      notes: '',
    }));
    setShowSearch(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sets' || name === 'reps' || name === 'weight'
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/workout-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to log workout');
      }

      setFormData({
        exercise: '',
        sets: 1,
        reps: 1,
        muscleGroup: '',
        weight: undefined,
        notes: '',
      });
      
      router.refresh();
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to log workout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Exercise</label>
            <div className="flex gap-2">
              <Input
                name="exercise"
                value={formData.exercise}
                onChange={handleChange}
                placeholder="Exercise name"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showSearch && (
            <ExerciseSearch onSelectExercise={handleExerciseSelect} />
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Sets</label>
              <Input
                type="number"
                name="sets"
                value={formData.sets}
                onChange={handleChange}
                min={1}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Reps</label>
              <Input
                type="number"
                name="reps"
                value={formData.reps}
                onChange={handleChange}
                min={1}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Weight (lbs)</label>
              <Input
                type="number"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                min={0}
                step="0.5"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Muscle Group</label>
            <Select 
              value={formData.muscleGroup} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, muscleGroup: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select muscle group" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(muscleGroups).map(([groupKey, group]) => (
                  <SelectItem key={groupKey} value={groupKey}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Add any notes about your workout..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging...' : 'Log Workout'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}