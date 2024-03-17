import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProfitsPeriodQueryDto } from './dtos/profits-period-query.dto';
import { ProfitsService } from './profits.service';
import { ProfitsDto } from './dtos/profits.dto';

@Controller('profits')
@ApiTags('Profits')
export class ProfitsController {
  constructor(
    private profitsService: ProfitsService,
  ) {}

  @Get('today')
  async getTodayProfits(): Promise<ProfitsDto> {
    const todayProfits = await this.profitsService.getTodayProfits();
    return ProfitsDto.fromEntity(todayProfits);
  }

  @Get('current-month')
  async getCurrentMonthProfits(): Promise<ProfitsDto> {
    const currentMonthProfits = await this.profitsService.getCurrentMonthProfits();
    return ProfitsDto.fromEntity(currentMonthProfits);
  }

  @Get()
  async getProfitsOverAPeriodOfTime(
    @Query() profitsPeriodQueryDto: ProfitsPeriodQueryDto, 
  ): Promise<ProfitsDto> {
    const profits = await this.profitsService.getProfitsOverAPeriodOfTime(profitsPeriodQueryDto);
    return ProfitsDto.fromEntity(profits);
  }
}
