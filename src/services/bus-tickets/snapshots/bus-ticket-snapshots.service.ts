import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { BusTicketsService } from '../bus-tickets.service';
import { serviceSchema } from 'src/services/dtos/service.dto';
import { busTicketOnlySchema } from '../dtos/bus-ticket.dto';
import { ServiceType } from 'src/services/entities/service.entity';

@Injectable()
export class BusTicketSnapshotsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private busTicketsService: BusTicketsService,
  ) {}

  @Transactional()
  async createSnapshotOf(busTicketId: string): Promise<string> {
    const originalBusTicket = await this.busTicketsService.findOne(busTicketId);
    if (!originalBusTicket) {
      throw new Error(
        `Original bus ticket service not found: There is no bus ticket service with ID ${busTicketId}`
      );
    }

    const { id: snapshotId } = await this.currentTransaction.serviceSnapshot.create({
      data: {
        ...serviceSchema.omit({ id: true, serviceType: true }).parse(originalBusTicket),
        serviceType: ServiceType.BUS_TICKET,
        originalServiceId: originalBusTicket.id,
      },
      select: {
        id: true,
      }
    });

    await this.currentTransaction.busTicketSnapshot.create({
      data: {
        ...busTicketOnlySchema.parse(originalBusTicket),
        id: snapshotId,
      },
    });

    return snapshotId;
  }
}
