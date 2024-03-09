import { Employee as EmployeeModel, EmployeeOccupation as PrismaEmployeeOccupation } from '@prisma/client';

export type EmployeeEntity = EmployeeModel;

export type EmployeeOccupation = PrismaEmployeeOccupation;
export const EmployeeOccupation = PrismaEmployeeOccupation;
