// types/program.ts

export interface WorkoutLog {
    id: string;
    userId: string;
    exercise: string;
    sets: number;
    reps: number;
    weight?: number | null;
    muscleGroup?: string | null;
    notes?: string | null;
    createdAt: Date;
  }
  
  export interface ProgramExercise {
    id?: string;
    exerciseName: string;
    sets: number;
    reps: number;
    notes?: string | null;
    order: number;
    muscleGroup?: string | null;
    workoutProgramId?: string;
  }
  
  export interface WorkoutProgram {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    exercises: ProgramExercise[];
    createdAt: Date;
    updatedAt?: Date;
    isPublic: boolean;
    authorName?: string;
  }
  
  export interface CreateWorkoutProgram {
    name: string;
    description: string | null;  // Changed from string | undefined
    exercises: Omit<ProgramExercise, 'id' | 'workoutProgramId'>[];
    isPublic?: boolean;
  }