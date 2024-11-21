'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Dumbbell, Play, CheckCircle2, MoreVertical, Pencil, Trash2, Plus, Search, GripVertical, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import CreateProgramDialog from './CreateProgramDialog';
import { WorkoutProgram, ProgramExercise } from '@/types/program';
import { Exercise } from '@/types/exercise';
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
  const [editingProgram, setEditingProgram] = useState<WorkoutProgram | null>(null);
  const [deletingProgram, setDeletingProgram] = useState<WorkoutProgram | null>(null);
  const [exerciseSearchOpen, setExerciseSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [exercises, setExercises] = useState<ExecutionExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search and add exercise handlers
  const handleSearchExercises = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/exercises?name=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching exercises:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const addExerciseToProgram = (exercise: Exercise) => {
    if (!editingProgram) return;

    setEditingProgram(prev => {
      if (!prev) return null;

      return {
        ...prev,
        exercises: [
          ...prev.exercises,
          {
            id: `temp-${Date.now()}`, // Temporary ID for new exercises
            exerciseName: exercise.name,
            sets: 3,
            reps: 10,
            notes: '',
            order: prev.exercises.length,
            muscleGroup: exercise.muscle,
            workoutProgramId: prev.id
          }
        ]
      };
    });
    setExerciseSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeExerciseFromProgram = (index: number) => {
    setEditingProgram(prev => {
      if (!prev) return null;

      const newExercises = [...prev.exercises];
      newExercises.splice(index, 1);
      
      return {
        ...prev,
        exercises: newExercises.map((ex, idx) => ({
          ...ex,
          order: idx
        }))
      };
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !editingProgram) return;

    const exercises = Array.from(editingProgram.exercises);
    const [reorderedExercise] = exercises.splice(result.source.index, 1);
    exercises.splice(result.destination.index, 0, reorderedExercise);

    setEditingProgram({
      ...editingProgram,
      exercises: exercises.map((exercise, index) => ({
        ...exercise,
        order: index
      }))
    });
  };

  const handleEditProgram = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProgram) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/workout-programs/${editingProgram.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingProgram.name,
          description: editingProgram.description,
          exercises: editingProgram.exercises,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update program');
      }

      setEditingProgram(null);
      router.refresh();
    } catch (error) {
      console.error('Error updating program:', error);
      alert('Failed to update program');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete program handlers
  const handleDeleteProgram = async () => {
    if (!deletingProgram) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/workout-programs/${deletingProgram.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete program');
      }

      setDeletingProgram(null);
      router.refresh();
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program');
    } finally {
      setIsLoading(false);
    }
  };

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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingProgram(program)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeletingProgram(program)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {/* Edit Program Dialog */}
      <Dialog open={!!editingProgram} onOpenChange={(open) => !open && setEditingProgram(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleEditProgram}>
            <DialogHeader>
              <DialogTitle>Edit Program</DialogTitle>
              <DialogDescription>
                Make changes to your workout program.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Program Name</label>
                <Input
                  required
                  value={editingProgram?.name || ''}
                  onChange={(e) => setEditingProgram(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingProgram?.description || ''}
                  onChange={(e) => setEditingProgram(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Exercises</label>
                  <Popover open={exerciseSearchOpen} onOpenChange={setExerciseSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Exercise
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 w-80" align="end">
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Search exercises..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSearchExercises();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleSearchExercises}
                            disabled={isSearching}
                          >
                            {isSearching ? (
                              <span className="animate-spin">⌛</span>
                            ) : (
                              <Search className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        {searchResults.length > 0 ? (
                          <ul className="max-h-[300px] overflow-auto space-y-2">
                            {searchResults.map((exercise, index) => (
                              <li 
                                key={index}
                                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                                onClick={() => addExerciseToProgram(exercise)}
                              >
                                <div>
                                  <p className="font-medium">{exercise.name}</p>
                                  <p className="text-sm text-gray-500">{exercise.muscle}</p>
                                </div>
                                <Plus className="h-4 w-4" />
                              </li>
                            ))}
                          </ul>
                        ) : searchQuery && !isSearching ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No exercises found
                          </p>
                        ) : null}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="exercises">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {editingProgram?.exercises.map((exercise, index) => (
                          <Draggable
                            key={exercise.id}
                            draggableId={exercise.id ?? ''}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="p-4"
                              >
                                <div className="flex items-start gap-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mt-2 cursor-move"
                                  >
                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                      <h4 className="font-medium">{exercise.exerciseName}</h4>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeExerciseFromProgram(index)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm">Sets</label>
                                        <Input
                                          type="number"
                                          min={1}
                                          value={exercise.sets}
                                          onChange={(e) => {
                                            const newExercises = [...(editingProgram?.exercises || [])];
                                            newExercises[index] = {
                                              ...newExercises[index],
                                              sets: parseInt(e.target.value)
                                            };
                                            setEditingProgram(prev => 
                                              prev ? { ...prev, exercises: newExercises } : null
                                            );
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-sm">Reps</label>
                                        <Input
                                          type="number"
                                          min={1}
                                          value={exercise.reps}
                                          onChange={(e) => {
                                            const newExercises = [...(editingProgram?.exercises || [])];
                                            newExercises[index] = {
                                              ...newExercises[index],
                                              reps: parseInt(e.target.value)
                                            };
                                            setEditingProgram(prev => 
                                              prev ? { ...prev, exercises: newExercises } : null
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm">Notes</label>
                                      <Textarea
                                        value={exercise.notes || ''}
                                        onChange={(e) => {
                                          const newExercises = [...(editingProgram?.exercises || [])];
                                          newExercises[index] = {
                                            ...newExercises[index],
                                            notes: e.target.value
                                          };
                                          setEditingProgram(prev => 
                                            prev ? { ...prev, exercises: newExercises } : null
                                          );
                                        }}
                                        rows={2}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingProgram(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingProgram} onOpenChange={(open) => !open && setDeletingProgram(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingProgram?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <AlertDescription>
              This will permanently delete the program and all its exercises.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingProgram(null)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteProgram}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Program'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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