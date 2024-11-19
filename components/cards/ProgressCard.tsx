'use client';

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

// Update the interface to accept iconName instead of icon
interface ProgressCardProps {
    title: string;
    value: number;
    target: number;
    iconName: string;
    color?: string;
}

export default function ProgressCard({ title, value, target, iconName, color = "blue" }: ProgressCardProps) {
    const percentage = Math.min((value / target) * 100, 100);
    
    // Get the icon component dynamically
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>;

    const colorClasses: { [key: string]: string } = {
        blue: "bg-blue-50 text-blue-600",
        red: "bg-red-50 text-red-600",
        green: "bg-green-50 text-green-600",
    };

    const progressClasses: { [key: string]: string } = {
        blue: "bg-blue-600",
        red: "bg-red-600",
        green: "bg-green-600",
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {Icon && <Icon className="h-6 w-6" />}
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`${progressClasses[color]} rounded-full h-2 transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-sm text-gray-600 mt-2">Target: {target}</p>
        </motion.div>
    );
}