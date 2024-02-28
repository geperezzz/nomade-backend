import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1),
  'per-page': z.coerce.number().int().min(1),
});

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {
  page: number = super.page;
  'per-page': number = super['per-page'];
}
