/*
  Warnings:

  - Added the required column `lastName` to the `userprofile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userprofile" ADD COLUMN     "lastName" TEXT NOT NULL;
