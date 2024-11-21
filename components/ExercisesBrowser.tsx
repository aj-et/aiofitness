'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Exercise } from '@/types/exercise';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { muscleGroups } from '@/types/exercise';

export default function ExercisesBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';
  const initialMuscle = searchParams.get('muscle') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [selectedMuscle, setSelectedMuscle] = useState(initialMuscle);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateUrl = (newQuery: string, newMuscle: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('query', newQuery);
    if (newMuscle !== 'all') params.set('muscle', newMuscle);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  const searchExercises = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('name', query);
      if (selectedMuscle !== 'all') params.append('muscle', selectedMuscle);
      
      const response = await fetch(`/api/exercises?${params}`);
      const data = await response.json();
      setExercises(data);
      updateUrl(query, selectedMuscle);
    } catch (error) {
      console.error('Error searching exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises..."
          />
        </div>
        <div className="w-64">
          <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
            <SelectTrigger>
              <SelectValue placeholder="Select muscle group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All muscles</SelectItem>
              {Object.entries(muscleGroups).map(([groupKey, group]) => (
                <SelectGroup key={groupKey}>
                  <SelectLabel>{group.name}</SelectLabel>
                  {group.muscles.map((muscle) => (
                    <SelectItem key={muscle} value={muscle}>
                      {muscle.replace('_', ' ').charAt(0).toUpperCase() + muscle.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={searchExercises} disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise, index) => (
          <Card key={index} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Difficulty:</span>{' '}
                <span className={`${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
              </p>
              <p>
                <span className="font-medium">Muscle Group:</span> {exercise.muscle}
              </p>
              <p>
                <span className="font-medium">Equipment:</span> {exercise.equipment}
              </p>
              <div className="mt-4">
                <span className="font-medium">Instructions:</span>
                <p className="mt-1 text-gray-600 whitespace-pre-line">
                  {exercise.instructions}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'text-green-600';
    case 'intermediate':
      return 'text-yellow-600';
    case 'expert':
      return 'text-red-600';
    default:
      return '';
  }
}