/*
  Warnings:

  - You are about to drop the column `description` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ServiceSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ServiceSnapshot` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ServiceSnapshot` table. All the data in the column will be lost.
  - Added the required column `serviceDescription` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicePrice` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceDescription` to the `ServiceSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `ServiceSnapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicePrice` to the `ServiceSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "serviceDescription" TEXT NOT NULL,
ADD COLUMN     "serviceName" TEXT NOT NULL,
ADD COLUMN     "servicePrice" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "ServiceSnapshot" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "serviceDescription" TEXT NOT NULL,
ADD COLUMN     "serviceName" TEXT NOT NULL,
ADD COLUMN     "servicePrice" DECIMAL(65,30) NOT NULL;
