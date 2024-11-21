/*
  Warnings:

  - You are about to drop the column `exercises` on the `workoutprogram` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `workoutprogram` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `workoutprogram` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "workoutprogram_isPublic_idx";

-- AlterTable
ALTER TABLE "workoutprogram" DROP COLUMN "exercises",
DROP COLUMN "isPublic",
DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "ProgramExercise" (
    "id" TEXT NOT NULL,
    "workoutProgramId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "notes" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ProgramExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_workoutlogToworkoutprogram" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "ProgramExercise_workoutProgramId_idx" ON "ProgramExercise"("workoutProgramId");

-- CreateIndex
CREATE UNIQUE INDEX "_workoutlogToworkoutprogram_AB_unique" ON "_workoutlogToworkoutprogram"("A", "B");

-- CreateIndex
CREATE INDEX "_workoutlogToworkoutprogram_B_index" ON "_workoutlogToworkoutprogram"("B");

-- AddForeignKey
ALTER TABLE "ProgramExercise" ADD CONSTRAINT "ProgramExercise_workoutProgramId_fkey" FOREIGN KEY ("workoutProgramId") REFERENCES "workoutprogram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_workoutlogToworkoutprogram" ADD CONSTRAINT "_workoutlogToworkoutprogram_A_fkey" FOREIGN KEY ("A") REFERENCES "workoutlog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_workoutlogToworkoutprogram" ADD CONSTRAINT "_workoutlogToworkoutprogram_B_fkey" FOREIGN KEY ("B") REFERENCES "workoutprogram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
