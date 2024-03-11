import { Employee as EmployeeModel, EmployeeOccupation as PrismaEmployeeOccupation } from '@prisma/client';

import { StaffOccupationEntity } from '../staff-occupations/entities/staff-occupation.entity';

export type EmployeeEntity = Omit<EmployeeModel, 'occupations'> & {
  occupations: StaffOccupationEntity[];
};

export type StaffOccupationName = PrismaEmployeeOccupation;
export const StaffOccupationName = PrismaEmployeeOccupation;
