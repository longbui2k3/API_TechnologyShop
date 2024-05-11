import { BadRequestException, Injectable } from '@nestjs/common';
import { CartRepo } from 'src/models/repo/cart.repo';
import { OrderRepo } from 'src/models/repo/order.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { UserRepo } from 'src/models/repo/user.repo';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepo,
    private userRepo: UserRepo,
    private productRepo: ProductRepo,
    private cartRepo: CartRepo,
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
    const checkUserExists = await this.userRepo.checkUserExists(body.user);

    const checkExistedProducts = await Promise.all(
      body.products.map(async (product) => {
        const checkProductExists = await this.productRepo.checkProductExists(
          product.product,
        );
        return checkProductExists;
      }),
    );

    await Promise.all(
      body.products.map(async (product, i) => {
        if (product.quantity > checkExistedProducts[i].left) {
          throw new BadRequestException(
            'The quantity of product in store is not enough to order!',
          );
        }
        await this.productRepo.updateLeftOfProduct(
          product.product,
          -product.quantity,
        );
      }),
    );
    await this.cartRepo.removeItemsFromCart({
      userId: body.user,
      productIds: body.products.map((product) => product.product),
    });

    return await this.orderRepo.createOrder(body);
  }
}
