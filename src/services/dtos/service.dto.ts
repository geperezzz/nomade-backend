import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { ServiceEntity, ServiceType } from '../entities/service.entity';

export const serviceSchema = z.object({
  id: z.string().uuid(),
  serviceName: z.string(),
  serviceDescription: z.string(),
  serviceLocation: z.string(),
  servicePrice: z.coerce.number().nonnegative().finite(),
  serviceTimestamp: z.coerce.date(),
  serviceType: z.nativeEnum(ServiceType),
});

export class ServiceDto extends createZodDto(serviceSchema) {
  static fromEntity(entity: ServiceEntity): ServiceDto {
    return serviceSchema.parse(entity);
  }
}
