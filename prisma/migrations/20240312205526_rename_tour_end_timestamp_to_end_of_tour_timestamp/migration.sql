/*
  Warnings:

  - You are about to drop the column `durationInterval` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `durationInterval` on the `TourSnapshot` table. All the data in the column will be lost.
  - Added the required column `endOfTourTimestamp` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endOfTourTimestamp` to the `TourSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "durationInterval",
ADD COLUMN     "endOfTourTimestamp" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TourSnapshot" DROP COLUMN "durationInterval",
ADD COLUMN     "endOfTourTimestamp" TIMESTAMP(3) NOT NULL;
