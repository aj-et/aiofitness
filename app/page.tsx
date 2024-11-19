'use client';

import { sql } from "@vercel/postgres";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  Activity, 
  Flame, 
  Medal,
  Trophy,
  TrendingUp,
  Target,
  Scale,
  Utensils,
  Calendar,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { parse } from "path";

// Sample data - Replace with actual user data
const workoutData = [
  { day: 'Mon', calories: 320 },
  { day: 'Tue', calories: 450 },
  { day: 'Wed', calories: 280 },
  { day: 'Thu', calories: 550 },
  { day: 'Fri', calories: 470 },
  { day: 'Sat', calories: 600 },
  { day: 'Sun', calories: 400 },
];

interface ProgressCardProps {
  title: string;
  value: number;
  target: number;
  icon: React.ElementType;
  color: string;
}

// Progress Card Component
function ProgressCard({ title, value, target, icon: Icon, color }: ProgressCardProps) {
  const percentage = Math.min((value / target) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 bg-${color}-50 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-${color}-600 rounded-full h-2 transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">Target: {target}</p>
    </motion.div>
  );
}

interface WorkoutSummaryCardProps {
  title: string;
  stats: {
    label: string;
    value: number;
    icon: React.ElementType;
  }[];
}

// Workout Summary Card Component
function WorkoutSummaryCard({ title, stats }: WorkoutSummaryCardProps) {  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <stat.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Alex!</h1>
            <p className="text-gray-600">Here's your fitness summary for today</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Start Workout
          </motion.button>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Daily Steps"
            value={parseInt("8,439", 10)}
            target={parseInt("10,000", 10)}
            icon={Activity}
            color="blue"
          />
          <ProgressCard
            title="Calories Burned"
            value={parseInt("1,840", 10)}
            target={parseInt("2,200", 10)}
            icon={Flame}
            color="orange"
          />
          <ProgressCard
            title="Workout Minutes"
            value={parseInt("45", 10)}
            target={parseInt("60", 10)}
            icon={Clock}
            color="green"
          />
          <ProgressCard
            title="Water Intake"
            value={parseInt("1.8L", 10)}
            target={parseInt("2.5L", 10)}
            icon={Target}
            color="blue"
          />
        </div>

        {/* Charts and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Activity Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Today's Summary */}
          <WorkoutSummaryCard
            title="Today's Summary"
            stats={[
              { icon: Medal, label: "Workouts", value: 2/3 },
              { icon: Flame, label: "Calories", value: 1840 },
              { icon: Scale, label: "Weight", value: 75.5 },
              { icon: Utensils, label: "Protein", value: 120 }
            ]}
          />
        </div>

        {/* Recent Activities and Goals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {[
                { icon: Activity, title: "Morning Run", time: "8:00 AM", duration: "30 min", calories: "320" },
                { icon: Activity, title: "Weight Training", time: "10:30 AM", duration: "45 min", calories: "280" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <activity.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-sm text-gray-600">{activity.time} • {activity.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{activity.calories} cal</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Goals Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals Progress</h3>
            <div className="space-y-4">
              {[
                { icon: Trophy, title: "Weight Goal", progress: 75, target: "73 kg", current: "75.5 kg" },
                { icon: Medal, title: "Workout Goal", progress: 66, target: "3 sessions", current: "2 sessions" },
                { icon: Target, title: "Steps Goal", progress: 84, target: "10,000 steps", current: "8,439 steps" },
              ].map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <goal.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{goal.title}</span>
                    </div>
                    <span className="text-sm text-gray-600">{goal.current} / {goal.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}