/*
  Warnings:

  - Changed the type of `arrivalTimestamp` on the `TrainTicket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `arrivalTimestamp` on the `TrainTicketSnapshot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TrainTicket" DROP COLUMN "arrivalTimestamp",
ADD COLUMN     "arrivalTimestamp" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TrainTicketSnapshot" DROP COLUMN "arrivalTimestamp",
ADD COLUMN     "arrivalTimestamp" TIMESTAMP(3) NOT NULL;
