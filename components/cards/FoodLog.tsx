'use client';

import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

interface FoodEntry {
    id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface FoodLogProps {
    entries: FoodEntry[];
}

export default function FoodLog({ entries }: FoodLogProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Food Log</h3>
            <div className="space-y-4">
                {entries.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Utensils className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{entry.name}</h4>
                            <p className="text-sm text-gray-600">
                                P: {Math.round(entry.protein)}g • C: {Math.round(entry.carbs)}g • F: {Math.round(entry.fat)}g
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-gray-900">{entry.calories} cal</p>
                        </div>
                    </div>
                ))}
                {entries.length === 0 && (
                    <p className="text-gray-600 text-center py-4">No food entries logged today</p>
                )}
            </div>
        </motion.div>
    );
}