'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define proper types for our data
interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  fitnessGoal: string | null;
  activityLevel: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  firstName: string;
  lastName: string;
  age: string;
  weight: string;
  height: string;
  fitnessGoal: string;
  activityLevel: string;
}

interface Props {
  initialData: UserProfile | null;
}

export default function ProfileForm({ initialData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    age: initialData?.age?.toString() || '',
    weight: initialData?.weight?.toString() || '',
    height: initialData?.height?.toString() || '',
    fitnessGoal: initialData?.fitnessGoal || '',
    activityLevel: initialData?.activityLevel || '',
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age ? parseInt(formData.age) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          fitnessGoal: formData.fitnessGoal || null,
          activityLevel: formData.activityLevel || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      alert('Profile updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An error occurred while updating the profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName')(e)}
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName')(e)}
                  placeholder="Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age')(e)}
                  placeholder="25"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Weight (lbs)</label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight')(e)}
                  placeholder="150"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Height (inches)</label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange('height')(e)}
                  placeholder="70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness Goal</label>
                <Select 
                  value={formData.fitnessGoal}
                  onValueChange={(value) => handleChange('fitnessGoal')(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weightLoss">Weight Loss</SelectItem>
                    <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="general">General Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Activity Level</label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => handleChange('activityLevel')(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Lightly Active</SelectItem>
                    <SelectItem value="moderate">Moderately Active</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="veryActive">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}