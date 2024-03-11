import { Injectable } from '@nestjs/common';

import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Page } from 'src/common/pagination/page.type';
import { AvailableOccupationEntity } from './entities/available-occupation.entity';
import { StaffOccupationName } from '../entities/employee.entity';

@Injectable()
export class AvailableOccupationsService {
  constructor() {}

  async findMany(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Page<AvailableOccupationEntity>> {
    const availableOccupations = Object
      .values(StaffOccupationName)
      .map(occupationName => ({ occupationName }));
    
    const pageIndex = paginationQueryDto.page;
    const itemsPerPage = paginationQueryDto['per-page'];
    const items = availableOccupations
      .slice(itemsPerPage * (pageIndex - 1), itemsPerPage * pageIndex);
    const itemCount = availableOccupations.length;
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
