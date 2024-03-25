import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { AirlineTicketsService } from '../airline-tickets.service';
import { serviceSchema } from 'src/services/dtos/service.dto';
import { airlineTicketOnlySchema } from '../dtos/airline-ticket.dto';
import { ServiceType } from 'src/services/entities/service.entity';

@Injectable()
export class AirlineTicketSnapshotsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private airlineTicketsService: AirlineTicketsService,
  ) {}

  @Transactional()
  async createSnapshotOf(airlineTicketId: string): Promise<string> {
    const originalAirlineTicket =
      await this.airlineTicketsService.findOne(airlineTicketId);
    if (!originalAirlineTicket) {
      throw new Error(
        `Original airline ticket service not found: There is no airline ticket service with ID ${airlineTicketId}`,
      );
    }

    const { id: snapshotId } =
      await this.currentTransaction.serviceSnapshot.create({
        data: {
          ...serviceSchema
            .omit({ id: true, serviceType: true })
            .parse(originalAirlineTicket),
          serviceType: ServiceType.AIRLINE_TICKET,
          originalServiceId: originalAirlineTicket.id,
        },
        select: {
          id: true,
        },
      });

    await this.currentTransaction.airlineTicketSnapshot.create({
      data: {
        ...airlineTicketOnlySchema.parse(originalAirlineTicket),
        id: snapshotId,
      },
    });

    return snapshotId;
  }
}
