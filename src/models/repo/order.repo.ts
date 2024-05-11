import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Order } from '../order.model';
import { removeUndefinedInObject } from 'src/utils';
import { transaction } from 'src/helpers/transaction';

export class OrderRepo {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>,
    @InjectConnection() private connection: Connection,
  ) {}

  async createOrder(body: {
    user: string;
    checkout: {
      totalPrice: number;
      totalApplyDiscount: number;
      feeShip: number;
      total: number;
    };
    shipping_address: string;
    payment: string;
    coin: number;
    voucher: string;
    products: Array<{ product: string; quantity: number }>;
    phone: string;
  }) {
    return await transaction(this.connection, async (session) => {
      await Promise.all(body.products.map(async (product, i) => {
        
      }));
      const numberOfOrders = await this.orderModel.countDocuments({});
      return await this.orderModel.create({
        ...body,
        trackingNumber: `#${numberOfOrders + 1}`,
        status: 'pending',
        deliveredDate: Date.now(),
      });
    });
  }

  async findAllOrdersForUser(query: { user: string; sort: string }) {
    const sortBy: Record<string, 1 | -1> = Object.fromEntries(
      [query.sort].map((val) => [val, 1]),
    );

    let orders = await this.orderModel
      .find({ user: query.user })
      .sort(sortBy)
      .populate({ path: 'user', select: { _id: 1, name: 1, avatar: 1 } })
      .populate({ path: 'products.product', select: { name: 1, rating: 1 } })
      .lean();
    orders = orders.map((order) => {
      order.checkout.priceOfProducts = order.products.map(
        (product) => product.product.price,
      );
      return order;
    });
    return orders;
  }
}
