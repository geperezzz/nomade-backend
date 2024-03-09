/*
  Warnings:

  - The values [SALESMAN] on the enum `EmployeeOccupation` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `salesmanId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Salesman` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `salespersonId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeOccupation_new" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SALESPERSON');
ALTER TABLE "Employee" ALTER COLUMN "occupations" DROP DEFAULT;
ALTER TABLE "Employee" ALTER COLUMN "occupations" TYPE "EmployeeOccupation_new"[] USING ("occupations"::text::"EmployeeOccupation_new"[]);
ALTER TYPE "EmployeeOccupation" RENAME TO "EmployeeOccupation_old";
ALTER TYPE "EmployeeOccupation_new" RENAME TO "EmployeeOccupation";
DROP TYPE "EmployeeOccupation_old";
ALTER TABLE "Employee" ALTER COLUMN "occupations" SET DEFAULT ARRAY[]::"EmployeeOccupation"[];
COMMIT;

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_salesmanId_fkey";

-- DropForeignKey
ALTER TABLE "Salesman" DROP CONSTRAINT "Salesman_id_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "salesmanId",
ADD COLUMN     "salespersonId" UUID NOT NULL;

-- DropTable
DROP TABLE "Salesman";

-- CreateTable
CREATE TABLE "Salesperson" (
    "id" UUID NOT NULL,

    CONSTRAINT "Salesperson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Salesperson" ADD CONSTRAINT "Salesperson_id_fkey" FOREIGN KEY ("id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_salespersonId_fkey" FOREIGN KEY ("salespersonId") REFERENCES "Salesperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
