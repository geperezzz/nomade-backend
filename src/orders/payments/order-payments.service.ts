import { Injectable, NotFoundException } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { CreateOrderPaymentDto } from './dtos/create-order-payment.dto';
import { UpdateOrderPaymentDto } from './dtos/update-order-payment.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { OrderPaymentEntity } from './entities/order-payment.entity';
import Decimal from 'decimal.js';

const selectOrderPaymentEntityFields = {
  select: {
    paymentNumber: true,
    paymentTimestamp: true,
    netAmountPaid: true,
    amountWithCommissionPaid: true,
    appliedCommissionPercentage: true,
    paymentMethodId: true,
  },
} as const;

@Injectable()
export class OrderPaymentsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
  ) {}

  @Transactional()
  async create(orderId: string, createOrderPaymentDto: CreateOrderPaymentDto): Promise<OrderPaymentEntity> {
    const order = await this.currentTransaction.order.findUniqueOrThrow({
      where: {
        id: orderId,
      },
      select: {
        placementTimestamp: true,
      },
    });
    if (createOrderPaymentDto.paymentTimestamp < order.placementTimestamp) {
      throw new Error('Invalid payment: The payment timestamp is before the order placement timestamp');
    }
    
    const appliedCommissionPercentage = await this.getCommissionPercentageOfPaymentMethod(createOrderPaymentDto.paymentMethodId);
    const amountWithCommissionPaid = this.calculateAmountWithCommissionPaid(
      createOrderPaymentDto.netAmountPaid,
      appliedCommissionPercentage,
    );
    
    const createdOrderPayment = await this.currentTransaction.payment.create({
      data: {
        ...createOrderPaymentDto,
        orderId,
        appliedCommissionPercentage,
        amountWithCommissionPaid,
      },
      ...selectOrderPaymentEntityFields,
    });

    if (await this.isOrderOverpaid(orderId)) {
      throw new Error('Invalid payment: If the payment is created, the order would be overpaid');
    }
    return createdOrderPayment;
  }

  @Transactional()
  async findMany(
    orderId: string,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<OrderPaymentEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const items = await this.currentTransaction.payment.findMany({
      where: {
        orderId,
      },
      ...selectOrderPaymentEntityFields,
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });

    const itemCount = await this.currentTransaction.payment.count({
      where: {
        orderId,
      },
    });

    const pageCount = Math.ceil(itemCount / itemsPerPage);

    return {
      pageIndex,
      itemsPerPage,
      pageCount,
      itemCount,
      items,
    };
  }

  @Transactional()
  async findAll(orderId: string): Promise<OrderPaymentEntity[]> {
    return await this.currentTransaction.payment.findMany({
      where: {
        orderId,
      },
      ...selectOrderPaymentEntityFields,
    });
  }

  @Transactional()
  async findOne(orderId: string, paymentNumber: number): Promise<OrderPaymentEntity | null> {
    return await this.currentTransaction.payment.findUnique({
      where: {
        orderId_paymentNumber: {
          orderId,
          paymentNumber,
        },
      },
      ...selectOrderPaymentEntityFields,
    });
  }

  @Transactional()
  async update(
    orderId: string,
    paymentNumber: number,
    updateOrderPaymentDto: UpdateOrderPaymentDto,
  ): Promise<OrderPaymentEntity> {
    const oldOrderPayment = await this.findOne(orderId, paymentNumber);
    if (!oldOrderPayment) {
      throw new Error(
        `Order payment not found: There is no Order with ID ${orderId} that has a payment with ID ${paymentNumber}`,
      );
    }

    if (updateOrderPaymentDto.paymentTimestamp) {
      const order = await this.currentTransaction.order.findUniqueOrThrow({
        where: {
          id: orderId,
        },
        select: {
          placementTimestamp: true,
        },
      });
      if (updateOrderPaymentDto.paymentTimestamp < order.placementTimestamp) {
        throw new Error('Invalid payment: The payment timestamp is before the order placement timestamp');
      }
    }
    
    let netAmountPaid!: Decimal;
    if (updateOrderPaymentDto.netAmountPaid) {
      netAmountPaid = new Decimal(updateOrderPaymentDto.netAmountPaid);
    } else {
      netAmountPaid = oldOrderPayment.netAmountPaid;
    }
    
    let appliedCommissionPercentage!: Decimal;
    if (updateOrderPaymentDto.paymentMethodId) {
      appliedCommissionPercentage = await this.getCommissionPercentageOfPaymentMethod(updateOrderPaymentDto.paymentMethodId);
    } else {
      appliedCommissionPercentage = oldOrderPayment.appliedCommissionPercentage;
    }
    
    const amountWithCommissionPaid = this.calculateAmountWithCommissionPaid(
      netAmountPaid,
      appliedCommissionPercentage,
    );

    const updatedOrderPayment = await this.currentTransaction.payment.update({
      where: {
        orderId_paymentNumber: {
          orderId,
          paymentNumber,
        },
      },
      data: {
        ...updateOrderPaymentDto,
        appliedCommissionPercentage,
        amountWithCommissionPaid,
      },
      ...selectOrderPaymentEntityFields,
    });

    if (await this.isOrderOverpaid(orderId)) {
      throw new Error('Invalid payment: If the payment is updated, the order would be overpaid');
    }
    return updatedOrderPayment;
  }

  @Transactional()
  private async getCommissionPercentageOfPaymentMethod(paymentMethodId: string): Promise<Decimal> {
    const { commissionPercentage } = await this.currentTransaction.paymentMethod.findUniqueOrThrow({
      where: {
        id: paymentMethodId,
      },
      select: {
        commissionPercentage: true,
      },
    });
    return commissionPercentage;
  }

  private calculateAmountWithCommissionPaid(netAmountPaid: Decimal | number, appliedCommissionPercentage: Decimal | number): Decimal {
    if (typeof netAmountPaid === 'number') {
      netAmountPaid = new Decimal(netAmountPaid);
    }
    if (typeof appliedCommissionPercentage === 'number') {
      appliedCommissionPercentage = new Decimal(appliedCommissionPercentage);
    }
  
    return netAmountPaid.mul(Decimal.add(1, appliedCommissionPercentage.div(100)));
  }

  @Transactional()
  async remove(orderId: string, paymentNumber: number): Promise<OrderPaymentEntity> {
    return await this.currentTransaction.payment.delete({
      where: {
        orderId_paymentNumber: {
          orderId,
          paymentNumber,
        },
      },
      ...selectOrderPaymentEntityFields,
    });
  }

  @Transactional()
  private async isOrderOverpaid(orderId: string): Promise<boolean> {
    const order = await this.currentTransaction.order.findUniqueOrThrow({
      where: {
        id: orderId,
      },
    });
    const netAmountPaid = await this.calculateNetAmountPaidForOrder(orderId);
    return netAmountPaid.greaterThan(order.price);
  }

  @Transactional()
  private async calculateNetAmountPaidForOrder(orderId: string): Promise<Decimal> {
    const orderPayments = await this.findAll(orderId);
    return orderPayments.reduce(
      (netAmountPaid, orderPayment) => netAmountPaid.add(orderPayment.netAmountPaid),
      new Decimal(0),
    );
  }
}
