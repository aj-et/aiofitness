import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { 
  Activity, 
  Flame, 
  GlassWater,
  Scale,
} from "lucide-react";

import ProgressCard from '@/components/cards/ProgressCard';
import NutritionSummary from '@/components/cards/NutritionSummary';
import WeeklyCaloriesChart from '@/components/cards/WeeklyCaloriesChart';
import FoodLog from '@/components/cards/FoodLog';


// Fetch user data and related entries
async function getUserDashboardData(userId: string) {
  try {
    // Get user profile
    const userProfile = await prisma.userprofile.findUnique({
      where: { userId },
    });

    // Get today's food entries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaysFoodEntries = await prisma.foodentry.findMany({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
    });

    // Get today's water logs
    const todaysWaterLogs = await prisma.waterlog.findMany({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
    });

    // Get last 7 days of food entries for the chart
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    
    const weeklyFoodEntries = await prisma.foodentry.findMany({
      where: {
        userId,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      userProfile,
      todaysFoodEntries,
      todaysWaterLogs,
      weeklyFoodEntries,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

interface formatWeeklyDataProps {
  createdAt: Date;
  calories: number;
}

// Format weekly data for chart
function formatWeeklyData(entries: formatWeeklyDataProps[]) {
  const dailyData = {};
  
  entries.forEach(entry => {
    const date = new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
    const dailyData: { [date: string]: { calories: number } } = {};
    if (!dailyData[date]) {
      dailyData[date] = { calories: 0 };
    }
    dailyData[date].calories += entry.calories;
  });

  return Object.entries(dailyData).map(([day, data]) => ({
    day,
    calories: Math.round((data as { calories: number }).calories),
  }));
}

export default async function HomePage() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Please sign in to view your dashboard</p>
      </div>
    );
  }

  const { 
    userProfile,
    todaysFoodEntries,
    todaysWaterLogs,
    weeklyFoodEntries,
  } = await getUserDashboardData(userId);

  const totalWaterToday = todaysWaterLogs.reduce((sum, log) => sum + log.amount, 0);
  const weeklyData = formatWeeklyData(weeklyFoodEntries);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userProfile?.firstName}!
            </h1>
            <p className="text-gray-600">Here's your fitness summary for today</p>
          </div>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ProgressCard
                title="Calories Today"
                value={Math.round(todaysFoodEntries.reduce((sum, entry) => sum + entry.calories, 0))}
                target={2000}
                iconName="Flame"
                color="red"
            />
            <ProgressCard
                title="Water Intake"
                value={totalWaterToday}
                target={2500}
                iconName="GlassWater"
                color="blue"
            />
            <ProgressCard
                title="Current Weight"
                value={userProfile?.weight || 0}
                target={180}
                iconName="Scale"
                color="green"
            />
        </div>

        {/* Charts and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <WeeklyCaloriesChart data={weeklyData} />
          <NutritionSummary foodEntries={todaysFoodEntries} />
        </div>

        {/* Food Log */}
        <FoodLog entries={todaysFoodEntries} />
      </div>
    </main>
  );
}