/*
  Warnings:

  - A unique constraint covering the columns `[dni,deletedAt]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dni,deletedAt]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_dni_deletedAt_key" ON "Customer"("dni", "deletedAt") NULLS NOT DISTINCT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_dni_deletedAt_key" ON "Employee"("dni", "deletedAt") NULLS NOT DISTINCT;
