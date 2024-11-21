'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Dumbbell, Play, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CreateProgramDialog from './CreateProgramDialog';
import { WorkoutProgram, ProgramExercise } from '@/types/program';
import { useRouter } from 'next/navigation';

interface WorkoutProgramListProps {
  programs: WorkoutProgram[];
}

interface ExecutionExercise extends ProgramExercise {
  completed: boolean;
  actualSets: number;
  actualReps: number;
  actualWeight?: number;
}

export default function WorkoutProgramList({ programs }: WorkoutProgramListProps) {
  const router = useRouter();
  const [executingProgram, setExecutingProgram] = useState<WorkoutProgram | null>(null);
  const [exercises, setExercises] = useState<ExecutionExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartProgram = (program: WorkoutProgram) => {
    const initialExercises = program.exercises.map(exercise => ({
      ...exercise,
      completed: false,
      actualSets: exercise.sets,
      actualReps: exercise.reps,
      actualWeight: undefined,
    }));
    setExercises(initialExercises);
    setExecutingProgram(program);
  };

  const handleUpdateExercise = (index: number, field: keyof ExecutionExercise, value: any) => {
    setExercises(prev => 
      prev.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    );
  };

  const handleCompleteWorkout = async () => {
    setIsLoading(true);
    try {
      for (const exercise of exercises) {
        await fetch('/api/workout-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exercise: exercise.exerciseName,
            sets: exercise.actualSets,
            reps: exercise.actualReps,
            weight: exercise.actualWeight,
            muscleGroup: exercise.muscleGroup,
            notes: exercise.notes
          }),
        });
      }
      
      setExecutingProgram(null);
      setExercises([]);
      router.refresh();
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to log workout');
    } finally {
      setIsLoading(false);
    }
  };

  const allExercisesCompleted = exercises.every(exercise => exercise.completed);

  if (!Array.isArray(programs)) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <CreateProgramDialog />
        </div>
        <div className="text-center py-12">
          <p className="text-gray-600">No workout programs available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CreateProgramDialog />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.length > 0 ? (
          programs.map((program) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Dumbbell className="h-5 w-5" />
                      {program.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {program.description || 'No description provided'}
                  </p>
                  
                  {program.exercises && program.exercises.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium mb-2">Exercises:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {program.exercises.map((exercise, index) => (
                          <li key={index} className="mb-1">
                            {exercise.exerciseName} ({exercise.sets} sets x {exercise.reps} reps)
                            {exercise.notes && (
                              <span className="block ml-5 text-gray-500 text-xs">
                                Note: {exercise.notes}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(program.createdAt).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleStartProgram(program)}
                      className="flex items-center"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Start Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No workout programs created yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Click the "New Program" button to create your first workout program
            </p>
          </div>
        )}
      </div>

      <Dialog open={!!executingProgram} onOpenChange={(open) => !open && setExecutingProgram(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Following: {executingProgram?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {exercises.map((exercise, index) => (
              <Card key={index} className={`p-4 ${exercise.completed ? 'bg-gray-50' : ''}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{exercise.exerciseName}</h3>
                      <p className="text-sm text-gray-500">
                        Target: {exercise.sets} sets x {exercise.reps} reps
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateExercise(index, 'completed', !exercise.completed)}
                      className={exercise.completed ? 'text-green-600' : ''}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm">Sets</label>
                      <Input
                        type="number"
                        min={1}
                        value={exercise.actualSets}
                        onChange={(e) => handleUpdateExercise(index, 'actualSets', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Reps</label>
                      <Input
                        type="number"
                        min={1}
                        value={exercise.actualReps}
                        onChange={(e) => handleUpdateExercise(index, 'actualReps', parseInt(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Weight (lbs)</label>
                      <Input
                        type="number"
                        min={0}
                        step="0.5"
                        value={exercise.actualWeight || ''}
                        onChange={(e) => handleUpdateExercise(index, 'actualWeight', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {exercise.notes && (
                    <div>
                      <label className="text-sm">Notes</label>
                      <Textarea
                        value={exercise.notes || ''}
                        readOnly
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}

            <div className="flex justify-end">
              <Button
                onClick={handleCompleteWorkout}
                disabled={!allExercisesCompleted || isLoading}
              >
                {isLoading ? 'Saving...' : 'Complete Workout'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}