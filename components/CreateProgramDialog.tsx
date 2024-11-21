'use client';

import React, { useState } from 'react';
import { Plus, Search, GripVertical, X } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { CreateWorkoutProgram, ProgramExercise, WorkoutProgram } from '@/types/program';
import { Exercise } from '@/types/exercise';

interface CreateProgramProps {
  className?: string;
}

interface ProgramState extends Omit<WorkoutProgram, 'id' | 'createdAt' | 'userId'> {
  exercises: Omit<ProgramExercise, 'id' | 'workoutProgramId'>[];
}

const initialProgram: ProgramState = {
  name: '',
  description: null,  // Changed from empty string
  exercises: []
};


export default function CreateProgramDialog({ className }: CreateProgramProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [exerciseSearchOpen, setExerciseSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [program, setProgram] = useState<ProgramState>(initialProgram);
  const [isSearching, setIsSearching] = useState(false);

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

  const addExercise = (exercise: Exercise) => {
    setProgram(prev => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          exerciseName: exercise.name,
          sets: 3,
          reps: 10,
          notes: '',
          order: prev.exercises.length,
          muscleGroup: exercise.muscle
        }
      ]
    }));
    setExerciseSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeExercise = (index: number) => {
    setProgram(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const updateExercise = (
    index: number, 
    field: keyof Omit<ProgramExercise, 'id' | 'workoutProgramId'>, 
    value: any
  ) => {
    setProgram(prev => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => 
        i === index ? { ...exercise, [field]: value } : exercise
      )
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const exercises = Array.from(program.exercises);
    const [reorderedExercise] = exercises.splice(result.source.index, 1);
    exercises.splice(result.destination.index, 0, reorderedExercise);

    setProgram(prev => ({
      ...prev,
      exercises: exercises.map((exercise, index) => ({
        ...exercise,
        order: index
      }))
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const createProgramData: CreateWorkoutProgram = {
        name: program.name,
        description: program.description || null,  // Ensure null instead of undefined
        exercises: program.exercises
      };
  
      const response = await fetch('/api/workout-programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createProgramData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create program');
      }
  
      setProgram(initialProgram);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Failed to create program');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Plus className="mr-2 h-4 w-4" />
          New Program
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Program</DialogTitle>
            <DialogDescription>
              Create a new workout program with your selected exercises.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Program Name</label>
              <Input
                required
                value={program.name}
                onChange={(e) => setProgram(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Push Pull Legs"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={program.description || ''}  // Handle null case for display
                onChange={(e) => setProgram(prev => ({ 
                  ...prev, 
                  description: e.target.value || null  // Convert empty string to null
                }))}
                placeholder="Describe your program..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
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
                              onClick={() => addExercise(exercise)}
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
                      className="space-y-2"
                    >
                      {program.exercises.map((exercise, index) => (
                        <Draggable
                          key={`exercise-${index}`}
                          draggableId={`exercise-${index}`}
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
                                      onClick={() => removeExercise(index)}
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
                                        onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm">Reps</label>
                                      <Input
                                        type="number"
                                        min={1}
                                        value={exercise.reps}
                                        onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm">Notes</label>
                                    <Textarea
                                      value={exercise.notes || ''}
                                      onChange={(e) => updateExercise(index, 'notes', e.target.value)}
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
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Program'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}