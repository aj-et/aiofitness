'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

interface WorkoutProgram {
  id: string;
  name: string;
}

interface Props {
  programs: WorkoutProgram[];
}

interface FormData {
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
  workoutProgramId: string | null;
  notes: string;
}

export default function AddWorkoutLog({ programs }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    workoutProgramId: null,
    notes: '',
  });

  const handleChange = (name: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    const value = typeof e === 'string' ? e : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProgramChange = (value: string | null) => {
    setFormData(prev => ({
      ...prev,
      workoutProgramId: value
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/workout-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercise: formData.exercise,
          sets: parseInt(formData.sets),
          reps: parseInt(formData.reps),
          weight: formData.weight ? parseFloat(formData.weight) : null,
          workoutProgramId: formData.workoutProgramId,
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add workout log');
      }

      setFormData({
        exercise: '',
        sets: '',
        reps: '',
        weight: '',
        workoutProgramId: null,
        notes: '',
      });
      
      router.refresh();
    } catch (error) {
      console.error('Error adding workout log:', error);
      alert('Failed to add workout log');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Exercise Name</label>
            <Input
              required
              value={formData.exercise}
              onChange={handleChange('exercise')}
              placeholder="e.g., Bench Press"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sets</label>
              <Input
                required
                type="number"
                value={formData.sets}
                onChange={handleChange('sets')}
                placeholder="e.g., 3"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reps</label>
              <Input
                required
                type="number"
                value={formData.reps}
                onChange={handleChange('reps')}
                placeholder="e.g., 10"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (kg)</label>
              <Input
                type="number"
                step="0.5"
                value={formData.weight}
                onChange={handleChange('weight')}
                placeholder="e.g., 60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Program</label>
              <Select
                value={formData.workoutProgramId || undefined}
                onValueChange={handleProgramChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Input
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Any additional notes..."
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log Exercise
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}