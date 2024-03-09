import { Employee as EmployeeModel, EmployeeOccupation as PrismaEmployeeOccupation } from '@prisma/client';

export type EmployeeEntity = EmployeeModel;

export type StaffOccupation = PrismaEmployeeOccupation;
export const StaffOccupation = PrismaEmployeeOccupation;
