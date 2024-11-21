-- AlterTable
ALTER TABLE "workoutprogram" ADD COLUMN     "exercises" JSONB[],
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "workoutprogram_isPublic_idx" ON "workoutprogram"("isPublic");
