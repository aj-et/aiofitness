/*
  Warnings:

  - You are about to drop the column `muscle` on the `workoutlog` table. All the data in the column will be lost.
  - You are about to drop the column `workoutProgramId` on the `workoutlog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "workoutlog" DROP CONSTRAINT "workoutlog_workoutProgramId_fkey";

-- DropIndex
DROP INDEX "workoutlog_workoutProgramId_idx";

-- AlterTable
ALTER TABLE "workoutlog" DROP COLUMN "muscle",
DROP COLUMN "workoutProgramId",
ALTER COLUMN "muscleGroup" DROP NOT NULL;
