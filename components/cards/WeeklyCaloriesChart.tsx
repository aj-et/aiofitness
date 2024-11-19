'use client';

import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface ChartData {
    day: string;
    calories: number;
}

interface WeeklyCaloriesChartProps {
    data: ChartData[];
}

export default function WeeklyCaloriesChart({ data }: WeeklyCaloriesChartProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Calories</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                        type="monotone" 
                        dataKey="calories" 
                        stroke="#dc2626" 
                        strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}