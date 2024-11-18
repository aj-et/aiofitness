/*
  Warnings:

  - The primary key for the `foodentry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `foodentry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `waterlog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `waterlog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "foodentry" DROP CONSTRAINT "foodentry_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "foodentry_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "waterlog" DROP CONSTRAINT "waterlog_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "waterlog_pkey" PRIMARY KEY ("id");
