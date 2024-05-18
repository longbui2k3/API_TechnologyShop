import { Injectable } from '@nestjs/common';
import { OrderRepo } from 'src/models/repo/order.repo';

@Injectable()
export class StatisticService {
  constructor(private orderRepo: OrderRepo) {}

  async getRevenue() {
    return {
      message: 'Get revenue successfully!',
      status: 200,
      metadata: { statistics: await this.orderRepo.getRevenue() },
    };
  }

  async getRevenueByYear(year: number) {
    return {
      message: 'Get revenue by year successfully!',
      status: 200,
      metadata: { statistics: await this.orderRepo.getRevenueByYear(year) },
    };
  }

  async getRevenueByMonth(month: number, year: number) {
    return {
      message: 'Get revenue by month successfully!',
      status: 200,
      metadata: {
        statistics: await this.orderRepo.getRevenueByMonth(month, year),
      },
    };
  }
}
