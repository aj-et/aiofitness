-- CreateTable
CREATE TABLE "foodentry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "carbs" DOUBLE PRECISION NOT NULL,
    "fat" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "foodentry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userprofile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "age" INTEGER,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "fitnessGoal" TEXT,
    "activityLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userprofile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waterlog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waterlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" SERIAL NOT NULL,
    "positionName" VARCHAR(256) NOT NULL,
    "employeeName" VARCHAR(256) NOT NULL,
    "dateStarted" VARCHAR(15) NOT NULL,
    "dateEnded" VARCHAR(15) NOT NULL,
    "description1" VARCHAR(256) NOT NULL,
    "description2" VARCHAR(256) NOT NULL,
    "description3" VARCHAR(256) NOT NULL,
    "imageUrl" VARCHAR(256) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "description" VARCHAR(256) NOT NULL,
    "image" VARCHAR(256) NOT NULL,
    "html_link" VARCHAR(256) NOT NULL,
    "github_link" VARCHAR(256) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "foodentry_userId_idx" ON "foodentry"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userprofile_userId_key" ON "userprofile"("userId");

-- CreateIndex
CREATE INDEX "userprofile_userId_idx" ON "userprofile"("userId");

-- CreateIndex
CREATE INDEX "waterlog_userId_idx" ON "waterlog"("userId");

-- AddForeignKey
ALTER TABLE "foodentry" ADD CONSTRAINT "foodentry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userprofile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waterlog" ADD CONSTRAINT "waterlog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userprofile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
