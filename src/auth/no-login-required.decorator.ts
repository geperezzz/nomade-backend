import { SetMetadata, applyDecorators } from '@nestjs/common';

export const NoLoginRequired = () =>
  applyDecorators(SetMetadata('noAuthRequired', true));
