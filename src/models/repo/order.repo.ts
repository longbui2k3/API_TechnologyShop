import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Order } from '../order.model';

export class OrderRepo {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

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
      payment: string;
      coin: number;
      voucher: string;
      products: Array<{ product: string; quantity: number }>;
      phone: string;
      onlineBanking: string;
    },
    session?: ClientSession,
  ) {
    const numberOfOrders = await this.orderModel.countDocuments({});
    const order = new this.orderModel({
      ...body,
      trackingNumber: `#${numberOfOrders + 1}`,
      status: 'pending',
      deliveredDate: Date.now(),
    });
    if (order.onlineBanking) {
      order.paymentStatus = 'paid';
    }
    await order.save({ session });
    return order;
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
