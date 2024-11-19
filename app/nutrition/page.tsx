import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import AddFoodEntryForm from '@/components/forms/AddFoodEntryForm';
import { CalendarDays } from "lucide-react";
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

async function getFoodEntries(userId: string, timezone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  try {
    const now = new Date()
    const userDate = toZonedTime(now, timezone)
    
    const startOfDay = formatInTimeZone(
      new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate()),
      timezone,
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
    )
    
    const endOfDay = formatInTimeZone(
      new Date(userDate.getFullYear(), userDate.getMonth(), userDate.getDate() + 1),
      timezone,
      "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
    )
    
    const foodEntries = await prisma.foodentry.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return foodEntries
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export default async function NutritionPage() {
  const { userId } = await auth();
  
  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Please sign in to view your nutrition data</p>
      </div>
    );
  }

  const foodEntries = await getFoodEntries(userId);
  const totalCalories = foodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const totalProtein = foodEntries.reduce((sum, entry) => sum + entry.protein, 0);
  const totalCarbs = foodEntries.reduce((sum, entry) => sum + entry.carbs, 0);
  const totalFat = foodEntries.reduce((sum, entry) => sum + entry.fat, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Nutrition Tracker</h1>
          <p className="text-gray-600">Track your daily food intake and nutrients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <AddFoodEntryForm />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              Today's Summary
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Calories</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalCalories)}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Protein</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalProtein)}g</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Carbs</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalCarbs)}g</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total Fat</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalFat)}g</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Food Log</h2>
            {foodEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Food</th>
                      <th className="text-center py-3 px-4">Calories</th>
                      <th className="text-center py-3 px-4">Protein</th>
                      <th className="text-center py-3 px-4">Carbs</th>
                      <th className="text-center py-3 px-4">Fat</th>
                      <th className="text-right py-3 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-200 last:border-0">
                        <td className="py-4 px-4">{entry.name}</td>
                        <td className="text-center py-4 px-4">{entry.calories}</td>
                        <td className="text-center py-4 px-4">{Math.round(entry.protein)}g</td>
                        <td className="text-center py-4 px-4">{Math.round(entry.carbs)}g</td>
                        <td className="text-center py-4 px-4">{Math.round(entry.fat)}g</td>
                        <td className="text-right py-4 px-4">
                          {new Date(entry.createdAt).toLocaleTimeString(undefined, { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No food entries logged today</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}