import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import Decimal from 'decimal.js';

import { ProfitsPeriodQueryDto } from './dtos/profits-period-query.dto';
import { OrdersService } from 'src/orders/orders.service';
import { ProfitsEntity } from './entities/profits.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';

@Injectable()
export class ProfitsService {
  constructor(
    private ordersService: OrdersService,
  ) {}

  @Transactional()
  async getTodayProfits(): Promise<ProfitsEntity> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    console.log('Start of today:', startOfToday.toISOString())

    const endOfToday = new Date(startOfToday);
    endOfToday.setHours(23, 59, 59, 999);
    console.log('End of today:', endOfToday.toISOString())

    return await this.getProfitsOverAPeriodOfTime({
      from: startOfToday,
      to: endOfToday,
    });
  }

  @Transactional()
  async getCurrentMonthProfits(): Promise<ProfitsEntity> {
    const now = new Date();
    
    const startOfCurrentMonth = new Date(now);
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    return await this.getProfitsOverAPeriodOfTime({
      from: startOfCurrentMonth,
      to: now,
    });
  }

  @Transactional()
  async getProfitsOverAPeriodOfTime(
    profitsPeriodQueryDto: ProfitsPeriodQueryDto,
  ): Promise<ProfitsEntity> {
    const allPaidOrders = await this.ordersService.findPaidOrders();
    const paidOrdersToConsider = allPaidOrders.filter(order => {
      const timestampOfLastPayment = this.getTimestampOfLastPayment(order);
      return timestampOfLastPayment >= profitsPeriodQueryDto.from
        && timestampOfLastPayment <= profitsPeriodQueryDto.to
    }
    );

    const bestSellingServices = this.getBestSellingServices(paidOrdersToConsider);
    const profits = paidOrdersToConsider.reduce(
      (profits, order) => profits.add(order.price),
      new Decimal(0),
    );
    const numberOfPaidOrders = paidOrdersToConsider.length;
    
    return { profits, numberOfPaidOrders, bestSellingServices };
  }

  getTimestampOfLastPayment(order: OrderEntity): Date {
    return order.payments
      .reduce(
        (newestPayment, payment) => payment.paymentTimestamp > newestPayment.paymentTimestamp ? payment : newestPayment,
      )
      .paymentTimestamp;
  }

  getBestSellingServices(orders: OrderEntity[]) {
    const NUMBER_OF_BEST_SELLING_SERVICES = 5;
    
    const orderedServices = orders
      .map(
        order => order.orderedServices.map(
          orderedService => orderedService.serviceId
        )
      )
      .flat()
      .filter((serviceId): serviceId is string => serviceId !== null);

    const orderedPackageServices = orders
      .map(
        order => order.orderedPackages
          .map(
            orderedPackage => orderedPackage.packageSnapshot.containedServices.map(
              containedService => containedService.serviceId
            )
          )
          .flat()
      )
      .flat()
      .filter((serviceId): serviceId is string => serviceId !== null);

    const allOrderedServices = [...orderedServices, ...orderedPackageServices];
    const numberOfOrdersPerService = allOrderedServices.reduce(
      (numberOfOrdersPerService, serviceId) =>
        numberOfOrdersPerService.set(
          serviceId,
          (numberOfOrdersPerService.get(serviceId) || 0) + 1
        ),
      new Map<string, number>(),
    );
    const orderedServicesSortedByNumberOfOrders = [...numberOfOrdersPerService.entries()].sort((a, b) => a[1] - b[1]);
    
    return orderedServicesSortedByNumberOfOrders
      .slice(0, NUMBER_OF_BEST_SELLING_SERVICES + 1)
      .map(([serviceId, numberOfSales]) => ({ serviceId, numberOfSales }));
  }
}