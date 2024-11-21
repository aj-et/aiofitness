/*
  Warnings:

  - You are about to drop the `ProgramExercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProgramExercise" DROP CONSTRAINT "ProgramExercise_workoutProgramId_fkey";

-- DropTable
DROP TABLE "ProgramExercise";

-- CreateTable
CREATE TABLE "programexercise" (
    "id" TEXT NOT NULL,
    "workoutProgramId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "notes" TEXT,
    "order" INTEGER NOT NULL,
    "muscleGroup" TEXT,

    CONSTRAINT "programexercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "programexercise_workoutProgramId_idx" ON "programexercise"("workoutProgramId");

-- AddForeignKey
ALTER TABLE "programexercise" ADD CONSTRAINT "programexercise_workoutProgramId_fkey" FOREIGN KEY ("workoutProgramId") REFERENCES "workoutprogram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
