import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { TourEntity } from '../entities/tour.entity';
import { convertDecimalsToNumbers } from 'src/common/convert-decimals-to-numbers';
import { serviceSchema } from 'src/services/dtos/service.dto';

export const tourOnlySchema = z.object({
  tourType: z.string(),
  endOfTourTimestamp: z.coerce.date(),
});

export const tourSchema = serviceSchema
  .omit({ serviceType: true })
  .merge(tourOnlySchema)
  .refine((tour) => tour.endOfTourTimestamp > tour.serviceTimestamp, {
    message:
      'The end of the tour timestamp must follow the service timestamp (start of the tour timestamp)',
    path: ['endOfTourTimestamp'],
  });

export class TourDto extends createZodDto(tourSchema) {
  static fromEntity(entity: TourEntity): TourDto {
    return tourSchema.parse(convertDecimalsToNumbers(entity));
  }
}
