import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RolesGuard } from 'src/auth/authUtils/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { StatisticService } from 'src/services/statistic.service';

@Controller('/api/v1/statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}
  @Get('/revenue')
  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getRevenue() {
    return await this.statisticService.getRevenue();
  }

  @Get('/revenueByYear')
  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getRevenueByYear(@Query('year') year: number) {
    return await this.statisticService.getRevenueByYear(year);
  }

  @Get('/revenueByMonth')
  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getRevenueByMonth(
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return await this.statisticService.getRevenueByMonth(month, year);
  }

  @Get('/soldOfProducts')
  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getSoldOfProducts(@Query('year') year: number) {
    return await this.statisticService.getSoldOfProducts(year);
  }
}
