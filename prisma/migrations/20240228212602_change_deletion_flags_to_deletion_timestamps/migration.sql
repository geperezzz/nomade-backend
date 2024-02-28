/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);
