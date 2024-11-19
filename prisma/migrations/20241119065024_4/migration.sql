-- CreateTable
CREATE TABLE "workoutprogram" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workoutprogram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workoutlog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutProgramId" TEXT,
    "exercise" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workoutlog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "workoutprogram_userId_idx" ON "workoutprogram"("userId");

-- CreateIndex
CREATE INDEX "workoutlog_userId_idx" ON "workoutlog"("userId");

-- CreateIndex
CREATE INDEX "workoutlog_workoutProgramId_idx" ON "workoutlog"("workoutProgramId");

-- AddForeignKey
ALTER TABLE "workoutprogram" ADD CONSTRAINT "workoutprogram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userprofile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workoutlog" ADD CONSTRAINT "workoutlog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userprofile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workoutlog" ADD CONSTRAINT "workoutlog_workoutProgramId_fkey" FOREIGN KEY ("workoutProgramId") REFERENCES "workoutprogram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
