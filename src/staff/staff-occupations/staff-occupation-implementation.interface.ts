import { CreateStaffOccupationDto } from './dtos/create-staff-occupation.dto';
import { UpdateStaffOccupationDto } from './dtos/update-staff-occupation.dto';
import { StaffOccupationEntity } from './entities/staff-occupation.entity';

export interface StaffOccupationImplementation {
  create(
    employeeId: string,
    createStaffOccupationDto: CreateStaffOccupationDto
  ): Promise<StaffOccupationEntity>;
  
  find(employeeId: string): Promise<StaffOccupationEntity | null>;

  update(
    employeeId: string,
    updateStaffOccupationDto: UpdateStaffOccupationDto,
  ): Promise<StaffOccupationEntity>;

  remove(employeeId: string): Promise<StaffOccupationEntity>;
}