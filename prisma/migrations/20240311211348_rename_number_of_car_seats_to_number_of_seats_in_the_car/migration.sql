/*
  Warnings:

  - You are about to drop the column `numberOfCarSeats` on the `CarRentalSnapshot` table. All the data in the column will be lost.
  - Added the required column `numberOfSeatsInTheCar` to the `CarRentalSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarRentalSnapshot" DROP COLUMN "numberOfCarSeats",
ADD COLUMN     "numberOfSeatsInTheCar" INTEGER NOT NULL;
