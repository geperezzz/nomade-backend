import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

import { EmployeeEntity } from 'src/staff/entities/employee.entity';

export const Employee = createParamDecorator(
  (_data: unknown, context: ExecutionContext): EmployeeEntity => {
    const request = context.switchToHttp().getRequest();
    if (!request.employee) {
      throw new UnauthorizedException('Login required', '');
    }

    return request.employee;
  },
);
