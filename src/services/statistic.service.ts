import { Injectable } from '@nestjs/common';
import { OrderRepo } from 'src/models/repo/order.repo';
import { ProductRepo } from 'src/models/repo/product.repo';

@Injectable()
export class StatisticService {
  constructor(
    private orderRepo: OrderRepo,
    private productRepo: ProductRepo,
  ) {}

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

  async getSoldOfProducts(year: number) {
    const products = await this.productRepo.getAllProducts({ filter: {} });
    const statistics = await Promise.all(
      products.map(async (product) => {
        const sold = await this.orderRepo.getSoldOfProduct(product._id, year);
        return { product: product.name, sold };
      }),
    );
    return {
      message: 'Get sold of products successfully!',
      status: 200,
      metadata: {
        statistics,
      },
    };
  }
}
