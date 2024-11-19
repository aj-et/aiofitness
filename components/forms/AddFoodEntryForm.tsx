'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export default function AddFoodEntryForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const handleChange = (name: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/food-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          calories: parseInt(formData.calories),
          protein: parseFloat(formData.protein),
          carbs: parseFloat(formData.carbs),
          fat: parseFloat(formData.fat),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add food entry');
      }

      resetForm();
      router.refresh();
      alert('Food entry added successfully');
    } catch (error) {
      console.error('Error adding food entry:', error);
      alert('Failed to add food entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Food Name</label>
            <Input
              required
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="e.g., Chicken Breast"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Calories</label>
              <Input
                required
                type="number"
                value={formData.calories}
                onChange={handleChange('calories')}
                placeholder="e.g., 165"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Protein (g)</label>
              <Input
                required
                type="number"
                step="0.1"
                value={formData.protein}
                onChange={handleChange('protein')}
                placeholder="e.g., 31"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Carbs (g)</label>
              <Input
                required
                type="number"
                step="0.1"
                value={formData.carbs}
                onChange={handleChange('carbs')}
                placeholder="e.g., 0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fat (g)</label>
              <Input
                required
                type="number"
                step="0.1"
                value={formData.fat}
                onChange={handleChange('fat')}
                placeholder="e.g., 3.6"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Food Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}