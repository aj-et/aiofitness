import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { Dumbbell } from "lucide-react";
import AddWorkoutLog from '@/components/forms/AddWorkoutLog';
import WorkoutProgramList from '@/components/WorkoutProgramList';
import ExercisesBrowser from '@/components/ExercisesBrowser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

async function getWorkoutData(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysWorkouts = await prisma.workoutlog.findMany({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      todaysWorkouts,
    };
  } catch (error) {
    console.error('Error fetching workout data:', error);
    return {
      todaysWorkouts: [],
    };
  }
}

export default async function WorkoutPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Please sign in to view your workout data</p>
      </div>
    );
  }

  const { todaysWorkouts } = await getWorkoutData(userId);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Workout Tracker</h1>
          <p className="text-gray-600">Track your exercises and workout programs</p>
        </div>

        <Tabs defaultValue="log" className="space-y-6">
          <TabsList>
            <TabsTrigger value="log">Workout Log</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <AddWorkoutLog />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Today's Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Exercises</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {todaysWorkouts.length}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Total Sets</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {todaysWorkouts.reduce((sum, log) => sum + log.sets, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Workout Log</h2>
                {todaysWorkouts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">Exercise</th>
                          <th className="text-center py-3 px-4">Sets</th>
                          <th className="text-center py-3 px-4">Reps</th>
                          <th className="text-center py-3 px-4">Weight (lbs)</th>
                          <th className="text-left py-3 px-4">Muscle Group</th>
                          <th className="text-right py-3 px-4">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todaysWorkouts.map((log) => (
                          <tr key={log.id} className="border-b border-gray-200 last:border-0">
                            <td className="py-4 px-4">{log.exercise}</td>
                            <td className="text-center py-4 px-4">{log.sets}</td>
                            <td className="text-center py-4 px-4">{log.reps}</td>
                            <td className="text-center py-4 px-4">
                              {log.weight ? `${log.weight}lbs` : '-'}
                            </td>
                            <td className="py-4 px-4">
                              {log.muscleGroup || '-'}
                            </td>
                            <td className="text-right py-4 px-4">
                              {new Date(log.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No workouts logged today</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="exercises">
            <ExercisesBrowser />
          </TabsContent>

          <TabsContent value="programs">
            <WorkoutProgramList programs={[]} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}