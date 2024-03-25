import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { CreatePaymentMethodDto } from './dtos/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dtos/update-payment-method.dto';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { PaymentMethodEntity } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
  ) {}

  @Transactional()
  async create(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    return await this.currentTransaction.paymentMethod.create({
      data: createPaymentMethodDto,
    });
  }

  @Transactional()
  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<PaymentMethodEntity>> {
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];

    const items = await this.currentTransaction.paymentMethod.findMany({
      skip: itemsPerPage * (pageIndex - 1),
      take: itemsPerPage,
    });

    const itemCount = await this.currentTransaction.paymentMethod.count();

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
  async findOne(id: string): Promise<PaymentMethodEntity | null> {
    return await this.currentTransaction.paymentMethod.findUnique({
      where: {
        id,
      },
    });
  }

  @Transactional()
  async update(
    id: string,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    return await this.currentTransaction.paymentMethod.update({
      where: {
        id,
      },
      data: updatePaymentMethodDto,
    });
  }

  @Transactional()
  async remove(id: string): Promise<PaymentMethodEntity> {
    return await this.currentTransaction.paymentMethod.delete({
      where: {
        id,
      },
    });
  }
}
