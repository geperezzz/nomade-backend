/*
  Warnings:

  - Added the required column `hasStopover` to the `AirlineTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AirlineTicket" ADD COLUMN     "hasStopover" BOOLEAN NOT NULL;
