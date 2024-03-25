import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { z } from 'nestjs-zod/z';

import { StaffService } from 'src/staff/staff.service';
import { employeeSchema } from 'src/staff/dtos/employee.dto';
import {
  EmployeeEntity,
  StaffOccupationName,
} from 'src/staff/entities/employee.entity';
import { Reflector } from '@nestjs/core';

const tokenPayloadSchema = z.object({
  employeeId: employeeSchema.shape.id,
});

type TokenPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private staffService: StaffService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const noAuthRequired = this.reflector.getAllAndOverride<boolean>(
      'noAuthRequired',
      [context.getHandler(), context.getClass()],
    );

    if (noAuthRequired) {
      return true;
    }
    return (
      (await this.isAuthenticated(context)) &&
      (await this.isAuthorized(context))
    );
  }

  private async isAuthenticated(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    let tokenPayload!: unknown;
    try {
      tokenPayload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Invalid authentication token', '');
    }

    (request as any).employee =
      await this.extractEmployeeFromPayload(tokenPayload);

    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (!token) {
      throw new UnauthorizedException('Authentication token not found', '');
    }
    if (type !== 'Bearer') {
      throw new UnauthorizedException(
        'Invalid authentication token',
        'Token type is not Bearer',
      );
    }
    return token;
  }

  private async extractEmployeeFromPayload(
    tokenPayload: unknown,
  ): Promise<EmployeeEntity> {
    let parsedTokenPayload!: TokenPayload;
    try {
      parsedTokenPayload = tokenPayloadSchema.parse(tokenPayload);
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid authentication token',
        'Token payload is malformed',
      );
    }

    const employee = await this.staffService.findOne(
      parsedTokenPayload.employeeId,
    );
    if (!employee) {
      throw new UnauthorizedException(
        'Invalid authentication token',
        `The employee with ID ${parsedTokenPayload.employeeId} was not found`,
      );
    }

    return employee;
  }

  private async isAuthorized(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const employee: EmployeeEntity = (request as any).employee;

    const allowedOccupations = this.reflector.getAllAndMerge<
      [StaffOccupationName, ...StaffOccupationName[]]
    >('allowedOccupations', [context.getHandler(), context.getClass()]);

    const hasAnyOfTheAllowedOccupations = allowedOccupations.some(
      (allowedOccupation) =>
        employee.occupations.some(
          (employeeOccupation) =>
            employeeOccupation.occupationName === allowedOccupation,
        ),
    );

    if (!hasAnyOfTheAllowedOccupations) {
      throw new ForbiddenException(
        'The employee does not have any of the required occupations',
        `The employee must have any of the following occupations to access this resource: ${allowedOccupations.join(', ')}`,
      );
    }
    return true;
  }
}
