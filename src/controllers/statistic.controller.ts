import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { StatisticService } from 'src/services/statistic.service';

@Controller('/api/v1/statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}
  @Get('/revenue')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async getRevenue() {
    return await this.statisticService.getRevenue();
  }

  @Get('/revenueByYear')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async getRevenueByYear(@Query('year') year: number) {
    return await this.statisticService.getRevenueByYear(year);
  }

  @Get('/revenueByMonth')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async getRevenueByMonth(
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return await this.statisticService.getRevenueByMonth(month, year);
  }
}
