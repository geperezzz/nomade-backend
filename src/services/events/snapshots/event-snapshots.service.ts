import { Injectable } from '@nestjs/common';
import {
  InjectTransaction,
  Transaction,
  Transactional,
} from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

import { EventsService } from '../events.service';
import { serviceSchema } from 'src/services/dtos/service.dto';
import { eventOnlySchema } from '../dtos/event.dto';
import { ServiceType } from 'src/services/entities/service.entity';

@Injectable()
export class EventSnapshotsService {
  constructor(
    @InjectTransaction()
    private currentTransaction: Transaction<TransactionalAdapterPrisma>,
    private eventsService: EventsService,
  ) {}

  @Transactional()
  async createSnapshotOf(eventId: string): Promise<string> {
    const originalEvent = await this.eventsService.findOne(eventId);
    if (!originalEvent) {
      throw new Error(
        `Original event service not found: There is no event service with ID ${eventId}`,
      );
    }

    const { id: snapshotId } =
      await this.currentTransaction.serviceSnapshot.create({
        data: {
          ...serviceSchema
            .omit({ id: true, serviceType: true })
            .parse(originalEvent),
          serviceType: ServiceType.EVENT,
          originalServiceId: originalEvent.id,
        },
        select: {
          id: true,
        },
      });

    await this.currentTransaction.eventSnapshot.create({
      data: {
        ...eventOnlySchema.parse(originalEvent),
        id: snapshotId,
      },
    });

    return snapshotId;
  }
}
