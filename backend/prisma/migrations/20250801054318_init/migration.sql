-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "director" TEXT,
    "budget" DECIMAL(65,30),
    "location" TEXT,
    "duration" INTEGER,
    "year" INTEGER,
    "genre" TEXT,
    "rating" DECIMAL(65,30),
    "description" TEXT,
    "language" TEXT,
    "posterUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);
