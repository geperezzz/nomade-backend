import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response as ExpressResponse } from 'express';

export type SuccessfulResponse = {
  statusCode: number;
  data: unknown;
};

@Injectable()
export class SuccessfulResponseBuilderInterceptor
  implements NestInterceptor<unknown, SuccessfulResponse>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<SuccessfulResponse> {
    const response = context.switchToHttp().getResponse<ExpressResponse>();

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        data,
      })),
    );
  }
}
