import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive(),
  'per-page': z.coerce.number().int().positive(),
});

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {
  page: number = super.page;
  'per-page': number = super['per-page'];
}
