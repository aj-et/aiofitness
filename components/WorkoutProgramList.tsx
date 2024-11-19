'use client';

import { motion } from 'framer-motion';
import { Calendar, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WorkoutProgram {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

interface Props {
  programs: WorkoutProgram[];
}

export default function WorkoutProgramList({ programs }: Props) {
  if (!Array.isArray(programs)) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-600">No workout programs available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs.length > 0 ? (
        programs.map((program) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(program.createdAt).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-600">No workout programs created yet</p>
        </div>
      )}
    </div>
  );
}