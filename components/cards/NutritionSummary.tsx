'use client';

import { motion } from "framer-motion";
import { Activity, Flame, Utensils } from "lucide-react";

interface FoodEntry {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface NutritionSummaryProps {
    foodEntries: FoodEntry[];
}

export default function NutritionSummary({ foodEntries }: NutritionSummaryProps) {
    const totalNutrition = foodEntries.reduce((acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Nutrition</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                    <Flame className="h-5 w-5 text-red-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {Math.round(totalNutrition.calories)}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Utensils className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Protein</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {Math.round(totalNutrition.protein)}g
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                    <Activity className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Carbs</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {Math.round(totalNutrition.carbs)}g
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                    <Activity className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-600">Fat</p>
                    <p className="text-lg font-semibold text-gray-900">
                        {Math.round(totalNutrition.fat)}g
                    </p>
                </div>
            </div>
        </div>
        </motion.div>
    );
}