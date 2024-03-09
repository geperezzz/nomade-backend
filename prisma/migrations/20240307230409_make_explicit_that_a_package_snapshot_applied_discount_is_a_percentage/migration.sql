/*
  Warnings:

  - You are about to drop the column `appliedDiscount` on the `PackageSnapshot` table. All the data in the column will be lost.
  - Added the required column `appliedDiscountPercentage` to the `PackageSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PackageSnapshot" DROP COLUMN "appliedDiscount",
ADD COLUMN     "appliedDiscountPercentage" DECIMAL(65,30) NOT NULL;
