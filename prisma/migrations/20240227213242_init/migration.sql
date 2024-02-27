-- CreateEnum
CREATE TYPE "EmployeeOccupation" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SALESMAN');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('HOTEL_PER_NIGHT', 'CAR_RENTAL', 'BUS_TICKET', 'AIRLINE_TICKET', 'TRAIN_TICKET', 'TOUR', 'EVENT');

-- CreateEnum
CREATE TYPE "CarEngineType" AS ENUM ('GASOLINE', 'NATURAL_GAS', 'DIESEL', 'ELECTRIC');

-- CreateEnum
CREATE TYPE "BusSeatType" AS ENUM ('STANDARD', 'SEMI_BED', 'BED_EXECUTIVE', 'BED_SUITE');

-- CreateEnum
CREATE TYPE "AirplaneCabinType" AS ENUM ('ECONOMY', 'BUSINESS');

-- CreateEnum
CREATE TYPE "TrainCabinType" AS ENUM ('ECONOMY', 'BUSINESS');

-- CreateTable
CREATE TABLE "Customer" (
    "id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "birthdate" DATE NOT NULL,
    "citizenship" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "occupations" "EmployeeOccupation"[],
    "address" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "birthdate" DATE NOT NULL,
    "citizenship" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "salary" DECIMAL(65,30) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Salesman" (
    "id" UUID NOT NULL,

    CONSTRAINT "Salesman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "customerId" UUID NOT NULL,
    "salesmanId" UUID NOT NULL,
    "placementTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderPackage" (
    "orderId" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "amountOrdered" INTEGER NOT NULL,

    CONSTRAINT "OrderPackage_pkey" PRIMARY KEY ("orderId","packageId")
);

-- CreateTable
CREATE TABLE "OrderService" (
    "orderId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "amountOrdered" INTEGER NOT NULL,

    CONSTRAINT "OrderService_pkey" PRIMARY KEY ("orderId","serviceId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "orderId" UUID NOT NULL,
    "paymentNumber" SERIAL NOT NULL,
    "paymentTimestamp" TIMESTAMP(3) NOT NULL,
    "netAmountPaid" DECIMAL(65,30) NOT NULL,
    "amountWithCommissionPaid" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "appliedCommissionPercentage" DECIMAL(65,30) NOT NULL,
    "paymentMethodId" UUID NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("orderId","paymentNumber")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "commissionPercentage" INTEGER NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" UUID NOT NULL,
    "lastUpdateTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "appliedDiscount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageService" (
    "packageId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "amountContained" INTEGER NOT NULL,

    CONSTRAINT "PackageService_pkey" PRIMARY KEY ("packageId","serviceId")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "lastUpdateTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "serviceLocation" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "serviceTimestamp" TIMESTAMP(3) NOT NULL,
    "serviceType" "ServiceType" NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelPerNight" (
    "id" UUID NOT NULL,
    "numberOfNights" INTEGER NOT NULL,
    "numberOfStars" INTEGER NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "allowedNumberOfPeoplePerRoom" INTEGER NOT NULL,
    "checkoutTimestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotelPerNight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarRental" (
    "id" UUID NOT NULL,
    "carReturnTimestamp" TIMESTAMP(3) NOT NULL,
    "carBrand" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "numberOfSeatsInTheCar" INTEGER NOT NULL,
    "carEngineType" "CarEngineType" NOT NULL,

    CONSTRAINT "CarRental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusTicket" (
    "id" UUID NOT NULL,
    "arrivalLocation" TEXT NOT NULL,
    "arrivalTimestamp" TIMESTAMP(3) NOT NULL,
    "assignedBusSeat" TEXT NOT NULL,
    "busSeatType" "BusSeatType" NOT NULL,
    "busOperatingCompany" TEXT NOT NULL,

    CONSTRAINT "BusTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirlineTicket" (
    "id" UUID NOT NULL,
    "arrivalLocation" TEXT NOT NULL,
    "arrivalTimestamp" TIMESTAMP(3) NOT NULL,
    "airline" TEXT NOT NULL,
    "assignedCabinType" "AirplaneCabinType" NOT NULL,

    CONSTRAINT "AirlineTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainTicket" (
    "id" UUID NOT NULL,
    "arrivalLocation" TEXT NOT NULL,
    "arrivalTimestamp" TEXT NOT NULL,
    "trainOperatingCompany" TEXT NOT NULL,
    "assignedCabinType" "TrainCabinType" NOT NULL,

    CONSTRAINT "TrainTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tour" (
    "id" UUID NOT NULL,
    "tourType" TEXT NOT NULL,
    "durationInterval" TEXT NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "durationInterval" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSnapshot" (
    "id" UUID NOT NULL,
    "snapshotTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalPackageId" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "appliedDiscount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "PackageSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSnapshotService" (
    "packageId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "amountContained" INTEGER NOT NULL,

    CONSTRAINT "PackageSnapshotService_pkey" PRIMARY KEY ("packageId","serviceId")
);

-- CreateTable
CREATE TABLE "ServiceSnapshot" (
    "id" UUID NOT NULL,
    "snapshotTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalServiceId" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "serviceLocation" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "serviceTimestamp" TIMESTAMP(3) NOT NULL,
    "serviceType" "ServiceType" NOT NULL,

    CONSTRAINT "ServiceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelPerNightSnapshot" (
    "id" UUID NOT NULL,
    "numberOfNights" INTEGER NOT NULL,
    "numberOfStars" INTEGER NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "allowedNumberOfPeoplePerRoom" INTEGER NOT NULL,
    "checkoutTimestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HotelPerNightSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarRentalSnapshot" (
    "id" UUID NOT NULL,
    "carReturnTimestamp" TIMESTAMP(3) NOT NULL,
    "carBrand" TEXT NOT NULL,
    "carModel" TEXT NOT NULL,
    "numberOfCarSeats" INTEGER NOT NULL,
    "carEngineType" "CarEngineType" NOT NULL,

    CONSTRAINT "CarRentalSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusTicketSnapshot" (
    "id" UUID NOT NULL,
    "arrivalLocation" TEXT NOT NULL,
    "arrivalTimestamp" TIMESTAMP(3) NOT NULL,
    "assignedBusSeat" TEXT NOT NULL,
    "busSeatType" "BusSeatType" NOT NULL,
    "busOperatingCompany" TEXT NOT NULL,

    CONSTRAINT "BusTicketSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AirlineTicketSnapshot" (
    "id" UUID NOT NULL,
    "arrivalLocation" TEXT NOT NULL,
    "arrivalTimestamp" TIMESTAMP(3) NOT NULL,
    "airline" TEXT NOT NULL,
    "assignedCabinType" "AirplaneCabinType" NOT NULL,
    "hasStopover" BOOLEAN NOT NULL,

    CONSTRAINT "AirlineTicketSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainTicketSnapshot" (
    "id" UUID NOT NULL,
    "arrivalLocation" TEXT NOT NULL,
    "arrivalTimestamp" TEXT NOT NULL,
    "trainOperatingCompany" TEXT NOT NULL,
    "assignedCabinType" "TrainCabinType" NOT NULL,

    CONSTRAINT "TrainTicketSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TourSnapshot" (
    "id" UUID NOT NULL,
    "tourType" TEXT NOT NULL,
    "durationInterval" TEXT NOT NULL,

    CONSTRAINT "TourSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSnapshot" (
    "id" UUID NOT NULL,
    "eventType" TEXT NOT NULL,
    "durationInterval" TEXT NOT NULL,

    CONSTRAINT "EventSnapshot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Salesman" ADD CONSTRAINT "Salesman_id_fkey" FOREIGN KEY ("id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_salesmanId_fkey" FOREIGN KEY ("salesmanId") REFERENCES "Salesman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPackage" ADD CONSTRAINT "OrderPackage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPackage" ADD CONSTRAINT "OrderPackage_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "PackageSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderService" ADD CONSTRAINT "OrderService_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderService" ADD CONSTRAINT "OrderService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageService" ADD CONSTRAINT "PackageService_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageService" ADD CONSTRAINT "PackageService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelPerNight" ADD CONSTRAINT "HotelPerNight_id_fkey" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarRental" ADD CONSTRAINT "CarRental_id_fkey" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusTicket" ADD CONSTRAINT "BusTicket_id_fkey" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirlineTicket" ADD CONSTRAINT "AirlineTicket_id_fkey" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainTicket" ADD CONSTRAINT "TrainTicket_id_fkey" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_id_fkey" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_id_fkey" FOREIGN KEY ("id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSnapshot" ADD CONSTRAINT "PackageSnapshot_originalPackageId_fkey" FOREIGN KEY ("originalPackageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSnapshotService" ADD CONSTRAINT "PackageSnapshotService_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "PackageSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSnapshotService" ADD CONSTRAINT "PackageSnapshotService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSnapshot" ADD CONSTRAINT "ServiceSnapshot_originalServiceId_fkey" FOREIGN KEY ("originalServiceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelPerNightSnapshot" ADD CONSTRAINT "HotelPerNightSnapshot_id_fkey" FOREIGN KEY ("id") REFERENCES "ServiceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarRentalSnapshot" ADD CONSTRAINT "CarRentalSnapshot_id_fkey" FOREIGN KEY ("id") REFERENCES "ServiceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusTicketSnapshot" ADD CONSTRAINT "BusTicketSnapshot_id_fkey" FOREIGN KEY ("id") REFERENCES "ServiceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AirlineTicketSnapshot" ADD CONSTRAINT "AirlineTicketSnapshot_id_fkey" FOREIGN KEY ("id") REFERENCES "ServiceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainTicketSnapshot" ADD CONSTRAINT "TrainTicketSnapshot_id_fkey" FOREIGN KEY ("id") REFERENCES "ServiceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourSnapshot" ADD CONSTRAINT "TourSnapshot_id_fkey" FOREIGN KEY ("id") REFERENCES "ServiceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSnapshot" ADD CONSTRAINT "EventSnapshot_id_fkey" FOREIGN KEY ("id") REFERENCES "ServiceSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE FUNCTION update_package_price_after_inserting_or_deleting_package_services() RETURNS trigger AS $$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            UPDATE "Package" AS p
            SET
                "price" = (
                    SELECT p."price" + NEW."amountContained" * (100 - p."appliedDiscount")/100 * s."price"
                    FROM "Service" AS s
                    WHERE s."id" = NEW."serviceId"
                )
            WHERE
                p."id" = NEW."packageId";

            RETURN NEW;
        END IF;

        UPDATE "Package" AS p
            SET
                "price" = (
                    SELECT p."price" - OLD."amountContained" * (100 - p."appliedDiscount")/100 * s."price"
                    FROM "Service" AS s
                    WHERE s."id" = OLD."serviceId"
                )
            WHERE
                p."id" = OLD."packageId";

        RETURN OLD;
    END
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_package_price_after_inserting_or_deleting_package_services
AFTER INSERT OR DELETE ON "PackageService"
FOR EACH ROW
EXECUTE FUNCTION update_package_price_after_inserting_or_deleting_package_services();

CREATE FUNCTION update_package_price_after_updating_amount_of_services_contained() RETURNS trigger AS $$
    BEGIN
        UPDATE "Package" AS p
        SET
            "price" = (
                SELECT p."price" + (NEW."amountContained" - OLD."amountContained") * (100 - p."appliedDiscount")/100 * s."price"
                FROM "Service" AS s
                WHERE s."id" = NEW."serviceId"
            )
        WHERE
            p."id" = NEW."packageId";

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_package_price_after_updating_amount_of_services_contained
AFTER UPDATE OF "amountContained" ON "PackageService"
FOR EACH ROW
EXECUTE FUNCTION update_package_price_after_updating_amount_of_services_contained();

CREATE FUNCTION update_package_price_after_updating_service_price() RETURNS trigger AS $$
    BEGIN
        UPDATE "Package" AS p
        SET
            "price" = (
                SELECT p."price" + ps."amountContained" * (100 - p."appliedDiscount")/100 * (NEW."price" - OLD."price")
                FROM "PackageService" AS ps
                WHERE
                    ps."packageId" = p."id"
                    AND ps."serviceId" = NEW."id"
            )
        WHERE
            p."id" IN (
                SELECT "packageId"
                FROM "PackageService" AS ps
                WHERE ps."serviceId" = NEW."id"
            );

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_package_price_after_updating_service_price
AFTER UPDATE OF "price" ON "Service"
FOR EACH ROW
EXECUTE FUNCTION update_package_price_after_updating_service_price();

CREATE FUNCTION update_package_price_after_updating_applied_discount() RETURNS trigger AS $$
    BEGIN
        UPDATE "Package"
        SET "price" = "price" * (100 - NEW."appliedDiscount") / (100 - OLD."appliedDiscount")
        WHERE "id" = NEW."id";

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_package_price_after_updating_applied_discount
AFTER UPDATE OF "appliedDiscount" ON "Package"
FOR EACH ROW
EXECUTE FUNCTION update_package_price_after_updating_applied_discount();

CREATE FUNCTION update_package_snapshot_price_after_inserting_or_deleting_package_snapshot_services() RETURNS trigger AS $$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            UPDATE "PackageSnapshot" AS pc
            SET
                "price" = (
                    SELECT pc."price" + NEW."amountContained" * (100 - pc."appliedDiscount")/100 * sc."price"
                    FROM "ServiceSnapshot" AS sc
                    WHERE s."id" = NEW."serviceId"
                )
            WHERE
                pc."id" = NEW."packageId";

            RETURN NEW;
        END IF;

        UPDATE "PackageSnapshot" AS pc
            SET
                "price" = (
                    SELECT pc."price" - OLD."amountContained" * (100 - pc."appliedDiscount")/100 * sc."price"
                    FROM "ServiceSnapshot" AS sc
                    WHERE sc."id" = OLD."serviceId"
                )
            WHERE
                pc."id" = OLD."packageId";

        RETURN OLD;
    END
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_package_snapshot_price_after_inserting_or_deleting_package_snapshot_services
AFTER INSERT OR DELETE ON "PackageSnapshotService"
FOR EACH ROW
EXECUTE FUNCTION update_package_snapshot_price_after_inserting_or_deleting_package_snapshot_services();

CREATE FUNCTION update_package_snapshot_price_after_updating_amount_of_service_copies_contained() RETURNS trigger AS $$
    BEGIN
        UPDATE "PackageSnapshot" AS pc
        SET
            "price" = (
                SELECT pc."price" + (NEW."amountContained" - OLD."amountContained") * (100 - pc."appliedDiscount")/100 * sc."price"
                FROM "ServiceSnapshot" AS sc
                WHERE sc."id" = NEW."serviceId"
            )
        WHERE
            pc."id" = NEW."packageId";

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_package_snapshot_price_after_updating_amount_of_service_copies_contained
AFTER UPDATE OF "amountContained" ON "PackageSnapshotService"
FOR EACH ROW
EXECUTE FUNCTION update_package_snapshot_price_after_updating_amount_of_service_copies_contained();

CREATE FUNCTION update_package_snapshot_price_after_updating_service_snapshot_price() RETURNS trigger AS $$
    BEGIN
        UPDATE "PackageSnapshot" AS pc
        SET
            "price" = (
                SELECT pc."price" + pcs."amountContained" * (100 - pc."appliedDiscount")/100 * (NEW."price" - OLD."price")
                FROM "PackageSnapshotService" AS pcs
                WHERE
                    pcs."packageId" = pc."id"
                    AND pcs."serviceId" = NEW."id"
            )
        WHERE
            pc."id" IN (
                SELECT "packageId"
                FROM "PackageSnapshotService" AS pcs
                WHERE pcs."serviceId" = NEW."id"
            );

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_package_snapshot_price_after_updating_service_snapshot_price
AFTER UPDATE OF "price" ON "ServiceSnapshot"
FOR EACH ROW
EXECUTE FUNCTION update_package_snapshot_price_after_updating_service_snapshot_price();

CREATE FUNCTION update_package_snapshot_price_after_updating_applied_discount() RETURNS trigger AS $$
    BEGIN
        UPDATE "PackageSnapshot"
        SET "price" = "price" * (100 - NEW."appliedDiscount") / (100 - OLD."appliedDiscount")
        WHERE "id" = NEW."id";

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_package_snapshot_price_after_updating_applied_discount
AFTER UPDATE OF "appliedDiscount" ON "PackageSnapshot"
FOR EACH ROW
EXECUTE FUNCTION update_package_snapshot_price_after_updating_applied_discount();

CREATE FUNCTION update_order_price_after_inserting_or_deleting_order_packages() RETURNS trigger AS $$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            UPDATE "Order" AS o
            SET
                "price" = (
                    SELECT o."price" + NEW."amountOrdered" * pc."price"
                    FROM "PackageSnapshot" AS pc
                    WHERE pc."id" = NEW."packageId"
                )
            WHERE
                o."id" = NEW."orderId";

            RETURN NEW;
        END IF;

        UPDATE "Order" AS o
            SET
                "price" = (
                    SELECT o."price" - OLD."amountOrdered" * pc."price"
                    FROM "PackageSnapshot" AS pc
                    WHERE pc."id" = OLD."packageId"
                )
            WHERE
                o."id" = OLD."orderId";

        RETURN OLD;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_price_after_inserting_or_deleting_order_packages
AFTER INSERT OR DELETE ON "OrderPackage"
FOR EACH ROW
EXECUTE FUNCTION update_order_price_after_inserting_or_deleting_order_packages();

CREATE FUNCTION update_order_price_after_updating_amount_of_packages_ordered() RETURNS trigger AS $$
    BEGIN
        UPDATE "Order" AS o
        SET
            "price" = (
                SELECT o."price" + (NEW."amountOrdered" - OLD."amountOrdered") * pc."price"
                FROM "PackageSnapshot" AS pc
                WHERE pc."id" = NEW."packageId"
            )
        WHERE
            o."id" = NEW."orderId";

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_price_after_updating_amount_of_packages_ordered
AFTER UPDATE OF "amountOrdered" ON "OrderPackage"
FOR EACH ROW
EXECUTE FUNCTION update_order_price_after_updating_amount_of_packages_ordered();

CREATE FUNCTION update_orders_prices_after_updating_package_snapshot_price() RETURNS trigger AS $$
    BEGIN
        UPDATE "Order" AS o
        SET
            "price" = (
                SELECT o."price" + op."amountOrdered" * (NEW."price" - OLD."price")
                FROM "OrderPackage" AS op
                WHERE
                    op."orderId" = o."id"
                    AND op."packageId" = NEW."id"
            )
        WHERE
            o."id" IN (
                SELECT "orderId"
                FROM "OrderPackage"
                WHERE "packageId" = NEW."id"
            );

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_prices_after_updating_package_snapshot_price
AFTER UPDATE OF "price" ON "PackageSnapshot"
FOR EACH ROW
EXECUTE FUNCTION update_orders_prices_after_updating_package_snapshot_price();

CREATE FUNCTION update_order_price_after_inserting_or_deleting_order_services() RETURNS trigger AS $$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            UPDATE "Order" AS o
            SET
                "price" = (
                    SELECT o."price" + NEW."amountOrdered" * sc."price"
                    FROM "ServiceSnapshot" AS sc
                    WHERE sc."id" = NEW."serviceId"
                )
            WHERE
                o."id" = NEW."orderId";

            RETURN NEW;
        END IF;

        UPDATE "Order" AS o
            SET
                "price" = (
                    SELECT o."price" - OLD."amountOrdered" * sc."price"
                    FROM "ServiceSnapshot" AS sc
                    WHERE sc."id" = OLD."serviceId"
                )
            WHERE
                o."id" = OLD."orderId";

        RETURN OLD;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_price_after_inserting_or_deleting_order_services
AFTER INSERT OR DELETE ON "OrderService"
FOR EACH ROW
EXECUTE FUNCTION update_order_price_after_inserting_or_deleting_order_services();

CREATE FUNCTION update_order_price_after_updating_amount_of_services_ordered() RETURNS trigger AS $$
    BEGIN
        UPDATE "Order" AS o
        SET
            "price" = (
                SELECT o."price" + (NEW."amountOrdered" - OLD."amountOrdered") * sc."price"
                FROM "ServiceSnapshot" AS sc
                WHERE sc."id" = NEW."serviceId"
            )
        WHERE
            o."id" = NEW."orderId";

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_price_after_updating_amount_of_services_ordered
AFTER UPDATE OF "amountOrdered" ON "OrderService"
FOR EACH ROW
EXECUTE FUNCTION update_order_price_after_updating_amount_of_services_ordered();

CREATE FUNCTION update_orders_prices_after_updating_service_snapshot_price() RETURNS trigger AS $$
    BEGIN
        UPDATE "Order" AS o
        SET
            "price" = (
                SELECT o."price" + os."amountOrdered" * (NEW."price" - OLD."price")
                FROM "OrderService" AS os
                WHERE
                    os."orderId" = o."id"
                    AND os."serviceId" = NEW."id"
            )
        WHERE
            o."id" IN (
                SELECT "orderId"
                FROM "OrderService"
                WHERE "serviceId" = NEW."id"
            );

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_prices_after_updating_service_snapshot_price
AFTER UPDATE OF "price" ON "ServiceSnapshot"
FOR EACH ROW
EXECUTE FUNCTION update_orders_prices_after_updating_service_snapshot_price();

CREATE FUNCTION update_payment_amount_with_commission_paid_after_updating_payment() RETURNS trigger AS $$
    BEGIN
        UPDATE "Payment"
        SET
            "amountWithCommissionPaid" = NEW."netAmountPaid" * (1 + NEW."appliedCommissionPercentage"/100)
        WHERE
            "orderId" = NEW."orderId"
            AND "paymentNumber" = NEW."paymentNumber";

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_amount_with_commission_paid_after_updating_payment
AFTER UPDATE OF "netAmountPaid", "appliedCommissionPercentage" ON "Payment"
FOR EACH ROW
EXECUTE FUNCTION update_payment_amount_with_commission_paid_after_updating_payment();