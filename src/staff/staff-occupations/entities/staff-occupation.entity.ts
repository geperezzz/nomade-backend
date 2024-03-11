import { SuperAdminOccupationEntity } from '../superadmin/entities/super-admin-occupation.entity';
import { AdminOccupationEntity } from '../admin/entities/admin-occupation.entity';
import { SalespersonOccupationEntity } from '../salesperson/entities/salesperson-occupation.entity';

export type StaffOccupationEntity = SuperAdminOccupationEntity
  | AdminOccupationEntity
  | SalespersonOccupationEntity;