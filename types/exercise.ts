export interface Exercise {
    name: string;
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
  }
  
  export const muscleGroups = {
    upper_body: {
      name: 'Upper Body',
      muscles: [
        'chest',
        'shoulders',
        'biceps',
        'triceps',
        'forearms',
        'traps',
        'lats',
      ]
    },
    core: {
      name: 'Core',
      muscles: [
        'abdominals',
        'lower_back',
        'middle_back',
      ]
    },
    lower_body: {
      name: 'Lower Body',
      muscles: [
        'quadriceps',
        'hamstrings',
        'glutes',
        'calves',
      ]
    },
    other: {
      name: 'Other',
      muscles: ['neck']
    }
  } as const;
  
  export type MuscleGroup = keyof typeof muscleGroups;
  export type Muscle = typeof muscleGroups[MuscleGroup]['muscles'][number];