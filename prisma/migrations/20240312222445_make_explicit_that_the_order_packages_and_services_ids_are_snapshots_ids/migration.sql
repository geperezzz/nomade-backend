/*
  Warnings:

  - The primary key for the `OrderPackage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `packageId` on the `OrderPackage` table. All the data in the column will be lost.
  - The primary key for the `OrderService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serviceId` on the `OrderService` table. All the data in the column will be lost.
  - Added the required column `packageSnapshotId` to the `OrderPackage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceSnapshotId` to the `OrderService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderPackage" DROP CONSTRAINT "OrderPackage_packageId_fkey";

-- DropForeignKey
ALTER TABLE "OrderService" DROP CONSTRAINT "OrderService_serviceId_fkey";

-- AlterTable
ALTER TABLE "OrderPackage" DROP CONSTRAINT "OrderPackage_pkey",
DROP COLUMN "packageId",
ADD COLUMN     "packageSnapshotId" UUID NOT NULL,
ADD CONSTRAINT "OrderPackage_pkey" PRIMARY KEY ("orderId", "packageSnapshotId");

-- AlterTable
ALTER TABLE "OrderService" DROP CONSTRAINT "OrderService_pkey",
DROP COLUMN "serviceId",
ADD COLUMN     "serviceSnapshotId" UUID NOT NULL,
ADD CONSTRAINT "OrderService_pkey" PRIMARY KEY ("orderId", "serviceSnapshotId");

-- AddForeignKey
ALTER TABLE "OrderPackage" ADD CONSTRAINT "OrderPackage_packageSnapshotId_fkey" FOREIGN KEY ("packageSnapshotId") REFERENCES "PackageSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderService" ADD CONSTRAINT "OrderService_serviceSnapshotId_fkey" FOREIGN KEY ("serviceSnapshotId") REFERENCES "ServiceSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
