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
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

interface ChartData {
    day: string;
    calories: number;
}

interface WeeklyCaloriesChartProps {
    data: ChartData[];
}

export default function WeeklyCaloriesChart({ data }: WeeklyCaloriesChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Calories</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="day" 
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip 
                                content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                    <div className="bg-white border border-gray-200 p-2 shadow-sm rounded-lg">
                                        <p className="text-sm font-medium">{`${payload[0].value} calories`}</p>
                                    </div>
                                    );
                                }
                                return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="calories"
                                stroke="#dc2626"
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 6, strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}