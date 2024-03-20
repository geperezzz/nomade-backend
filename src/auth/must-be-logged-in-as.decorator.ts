import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StaffOccupationName } from 'src/staff/entities/employee.entity'

export const MustBeLoggedInAs = (...occupations: [StaffOccupationName, ...StaffOccupationName[]]) => applyDecorators(
  SetMetadata('allowedOccupations', occupations),
  ApiBearerAuth(),
);