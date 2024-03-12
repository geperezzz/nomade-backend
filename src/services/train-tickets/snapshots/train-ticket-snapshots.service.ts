import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { TrainTicketsService } from '../train-tickets.service';
import { serviceSchema } from 'src/services/dtos/service.dto';
import { trainTicketOnlySchema } from '../dtos/train-ticket.dto';

@Injectable()
export class TrainTicketSnapshotsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private trainTicketsService: TrainTicketsService,
  ) {}

  @Transactional()
  async createSnapshotOf(trainTicketId: string): Promise<string> {
    const originalTrainTicket = await this.trainTicketsService.findOne(trainTicketId);
    if (!originalTrainTicket) {
      throw new Error(
        `Original train ticket service not found: There is no train ticket service with ID ${trainTicketId}`
      );
    }

    const { id: snapshotId } = await this.currentTransaction.serviceSnapshot.create({
      data: {
        ...serviceSchema.omit({ id: true }).parse(originalTrainTicket),
        originalServiceId: originalTrainTicket.id,
      },
      select: {
        id: true,
      }
    });

    await this.currentTransaction.trainTicketSnapshot.create({
      data: {
        ...trainTicketOnlySchema.parse(originalTrainTicket),
        id: snapshotId,
      },
      select: {},
    });

    return snapshotId;
  }
}
