/*
  Warnings:

  - A unique constraint covering the columns `[email,deletedAt]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,deletedAt]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_deletedAt_key" ON "Customer"("email", "deletedAt") NULLS NOT DISTINCT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_deletedAt_key" ON "Employee"("email", "deletedAt") NULLS NOT DISTINCT;
