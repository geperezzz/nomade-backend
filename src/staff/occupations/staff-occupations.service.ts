import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { StaffOccupationEntity } from './entities/staff-occupation.entity';
import { StaffOccupation } from '../entities/employee.entity';

@Injectable()
export class StaffOccupationsService {
  constructor() {}

  findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Page<StaffOccupationEntity> {
    const occupations = Object.values(StaffOccupation);
    
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];
    const items = occupations
      .slice(itemsPerPage * (pageIndex - 1), itemsPerPage * pageIndex)
      .map(name => ({ name }));
    const itemCount = occupations.length;
    const pageCount = Math.ceil(itemCount / itemsPerPage);

    return {
      pageIndex,
      itemsPerPage,
      pageCount,
      itemCount,
      items,
    };
  }
}
