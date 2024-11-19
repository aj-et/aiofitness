import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import AddWaterForm from '@/components/forms/AddWaterForm';
import QuickAddButton from '@/components/QuickAddButton';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplets } from "lucide-react";

// Fetch water logs for today
async function getWaterLogs(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const waterLogs = await prisma.waterlog.findMany({
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

    return waterLogs;
  } catch (error) {
    console.error('Error fetching water logs:', error);
    throw error;
  }
}

// Get user's profile for target water intake
async function getUserProfile(userId: string) {
  try {
    const profile = await prisma.userprofile.findUnique({
      where: { userId },
    });
    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export default async function WaterPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Please sign in to track your water intake</p>
      </div>
    );
  }

  const waterLogs = await getWaterLogs(userId);
  const userProfile = await getUserProfile(userId);
  const dailyWaterGoal = 2500; // Default goal in ml
  const totalWaterToday = waterLogs.reduce((sum, log) => sum + log.amount, 0);
  const progressPercentage = Math.min((totalWaterToday / dailyWaterGoal) * 100, 100);

  // Group water logs by hour for the chart
  const hourlyIntake: { [hour: number]: number } = {};
  waterLogs.forEach(log => {
    const hour = new Date(log.createdAt).getHours();
    hourlyIntake[hour] = (hourlyIntake[hour] || 0) + log.amount;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Water Intake Tracker</h1>
          <p className="text-gray-600">Track your daily water consumption</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Water Tracking Form */}
          <div>
            <AddWaterForm />
          </div>

          {/* Daily Progress Card */}
          <Card className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-900">Today's Progress</h2>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Droplets className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">{totalWaterToday}ml</span>
                <span className="text-sm text-gray-600">Goal: {dailyWaterGoal}ml</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Quick Add</h3>
              <div className="grid grid-cols-3 gap-3">
                {[250, 500, 750].map((amount) => (
                  <QuickAddButton
                    key={amount}
                    amount={amount}
                    userId={userId}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Water Log History */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Water Log</h2>
          {waterLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-right py-3 px-4">Amount (ml)</th>
                  </tr>
                </thead>
                <tbody>
                  {waterLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-200 last:border-0">
                      <td className="py-4 px-4">
                        {new Date(log.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                      <td className="text-right py-4 px-4">{log.amount}ml</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No water intake logged today</p>
          )}
        </Card>
      </div>
    </main>
  );
}