import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Exercise } from '@/types/exercise';

interface Props {
  onSelectExercise: (exercise: Exercise) => void;
}

export default function ExerciseSearch({ onSelectExercise }: Props) {
  const [query, setQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchExercises = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/exercises?name=${encodeURIComponent(query)}`);
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error('Error searching exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises..."
          className="flex-1"
        />
        <Button onClick={searchExercises} disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      
      {exercises.length > 0 && (
        <div className="max-h-60 overflow-y-auto border rounded-md">
          {exercises.map((exercise, index) => (
            <button
              key={index}
              onClick={() => onSelectExercise(exercise)}
              className="w-full p-3 text-left hover:bg-gray-50 border-b last:border-0"
            >
              <p className="font-medium">{exercise.name}</p>
              <p className="text-sm text-gray-600">
                {exercise.muscle} | {exercise.difficulty}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}