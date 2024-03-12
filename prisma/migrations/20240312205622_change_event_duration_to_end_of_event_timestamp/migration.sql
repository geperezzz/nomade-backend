/*
  Warnings:

  - You are about to drop the column `durationInterval` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `durationInterval` on the `EventSnapshot` table. All the data in the column will be lost.
  - Added the required column `endOfEventTimestamp` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endOfEventTimestamp` to the `EventSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "durationInterval",
ADD COLUMN     "endOfEventTimestamp" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EventSnapshot" DROP COLUMN "durationInterval",
ADD COLUMN     "endOfEventTimestamp" TIMESTAMP(3) NOT NULL;
