/*
  Warnings:

  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `muscle` to the `workoutlog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `muscleGroup` to the `workoutlog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_senderId_fkey";

-- AlterTable
ALTER TABLE "workoutlog" ADD COLUMN     "muscle" TEXT NOT NULL,
ADD COLUMN     "muscleGroup" TEXT NOT NULL;

-- DropTable
DROP TABLE "message";
