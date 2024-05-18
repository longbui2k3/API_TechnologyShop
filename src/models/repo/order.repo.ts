import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Order } from '../order.model';
import { daysOfMonth, removeUndefinedInObject } from 'src/utils';
import { BadRequestException } from '@nestjs/common';

export class OrderRepo {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async checkOrderExists(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new BadRequestException(`Order with id ${id} is not found!`);
    }
    return order;
  }

  async createOrder(
    body: {
      user: string;
      checkout: {
        totalPrice: number;
        totalApplyDiscount: number;
        feeShip: number;
        total: number;
      };
      shipping_address: string;
      payment: { method: string };
      coin: number;
      voucher: string;
      products: Array<{ product: string; quantity: number }>;
      phone: string;
    },
    session?: ClientSession,
  ) {
    const numberOfOrders = await this.orderModel.countDocuments({});
    const order = new this.orderModel({
      ...body,
      trackingNumber: `#${numberOfOrders + 1}`,
      status: 'pending',
      createdAt: Date.now(),
    });
    if (order.payment.method === 'onlineBanking') {
      order.paymentStatus = 'paid';
    }
    await order.save({ session });
    return order;
  }

  async findAllOrdersForUser(query: {
    user: string;
    sort: string;
    status: string;
  }) {
    const sortBy: Record<string, 1 | -1> = Object.fromEntries(
      [query.sort].map((val) => [val, 1]),
    );

    let orders = await this.orderModel
      .find(removeUndefinedInObject({ user: query.user, status: query.status }))
      .sort(sortBy)
      .populate({ path: 'user', select: { _id: 1, name: 1, avatar: 1 } })
      .populate({
        path: 'products.product',
        select: { name: 1, rating: 1, sale_price: 1, images: 1 },
      })
      .lean();
    orders = orders.map((order) => {
      order.checkout.priceOfProducts = order.products.map(
        (product) => product.product.sale_price,
      );
      return order;
    });
    return orders;
  }

  async findAllOrders(query: { sort: string; status: string }) {
    const sortBy: Record<string, 1 | -1> = Object.fromEntries(
      [query.sort].map((val) => [val, 1]),
    );

    let orders = await this.orderModel
      .find(removeUndefinedInObject({ status: query.status }))
      .sort(sortBy)
      .populate({ path: 'user', select: { _id: 1, name: 1, avatar: 1 } })
      .populate({
        path: 'products.product',
        select: { name: 1, rating: 1, sale_price: 1, images: 1 },
      })
      .lean();

    orders = orders.map((order) => {
      order.checkout.priceOfProducts = order.products.map(
        (product) => product.product.sale_price,
      );
      return order;
    });
    return orders;
  }

  async updateStatusOrders(order: string, status: string) {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      order,
      { status },
      { new: true },
    );
    return updatedOrder;
  }

  async getRevenue() {
    const orders = await this.orderModel.aggregate([
      {
        $match: {
          status: 'delivered',
        },
      },
      {
        $group: {
          _id: '_id',
          numberOfSuccessfulOrders: { $sum: 1 },
          revenue: { $sum: '$checkout.total' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    return orders[0];
  }

  async getRevenueByYear(year: number) {
    const orders = await this.orderModel.aggregate([
      {
        $match: {
          deliveredDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
          status: 'delivered',
        },
      },
    ]);
    const statistics = await this.orderModel.aggregate([
      {
        $match: {
          deliveredDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
          status: 'delivered',
        },
      },
      {
        $group: {
          _id: '_id',
          numberOfSuccessfulOrders: { $sum: 1 },
          revenue: { $sum: '$checkout.total' },
        },
      },
      { $project: { _id: 0 } },
    ]);

    if (statistics.length === 0) {
      statistics[0] = { numberOfSuccessfulOrders: 0, revenue: 0 };
    }

    const months = {};
    for (let i = 1; i <= 12; i++) {
      months[i] = { numberOfSuccessfulOrders: 0, revenue: 0 };
    }
    orders.forEach((order) => {
      const month = order.deliveredDate.getMonth() + 1;
      months[month].numberOfSuccessfulOrders += 1;
      months[month].revenue += order.checkout.total;
    });

    statistics[0].months = months;
    return statistics[0];
  }

  async getRevenueByMonth(month: number, year: number) {
    const orders = await this.orderModel.aggregate([
      {
        $match: {
          deliveredDate: {
            $gte: new Date(`${year}-${month}-01`),
            $lte: new Date(`${year}-${month}-${daysOfMonth(month, year)}`),
          },
          status: 'delivered',
        },
      },
    ]);

    const statistics = await this.orderModel.aggregate([
      {
        $match: {
          deliveredDate: {
            $gte: new Date(`${year}-${month}-01`),
            $lte: new Date(`${year}-${month}-${daysOfMonth(month, year)}`),
          },
          status: 'delivered',
        },
      },
      {
        $group: {
          _id: '_id',
          numberOfSuccessfulOrders: { $sum: 1 },
          revenue: { $sum: '$checkout.total' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    if (statistics.length === 0) {
      statistics[0] = { numberOfSuccessfulOrders: 0, revenue: 0 };
    }

    const days = {};
    for (let i = 1; i <= daysOfMonth(month, year); i++) {
      days[i] = { numberOfSuccessfulOrders: 0, revenue: 0 };
    }

    orders.forEach((order) => {
      const day = order.deliveredDate.getDate();
      days[day].numberOfSuccessfulOrders += 1;
      days[day].revenue += order.checkout.total;
    });

    statistics[0].days = days;

    return statistics[0];
  }
}
