import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { transaction } from 'src/helpers/transaction';
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
      const checkUserExists = await this.userRepo.checkUserExists(body.user);

      const checkExistedProducts = await Promise.all(
        body.products.map(async (product) => {
          const checkProductExists = await this.productRepo.checkProductExists(
            product.product,
          );
          return checkProductExists;
        }),
      );

      const itemsInCart = (
        await this.cartRepo.getAllCarts({ userId: body.user, unselect: [] })
      ).items;
      await Promise.all(
        body.products.map(async (product, i) => {
          if (product.quantity > checkExistedProducts[i].left) {
            throw new BadRequestException(
              'The quantity of product in store is not enough to order!',
            );
          }
          await this.productRepo.updateLeftOfProduct(
            {
              id: product.product,
              quantity: -product.quantity,
            },
            session,
          );

          let k = 0;
          itemsInCart.forEach((item) => {
            if (item.product._id.toString() === product.product) {
              if (item.quantity !== product.quantity) {
                throw new BadRequestException(
                  'Quantity of some products does not match!',
                );
              }
              k = 1;
            }
          });
          if (k === 0) {
            throw new BadRequestException('Some products is not in carts!');
          }
        }),
      );
      await this.cartRepo.removeItemsFromCart(
        {
          userId: body.user,
          productIds: body.products.map((product) => product.product),
        },
        session,
      );

      return {
        message: 'Create order successfully!',
        status: '201',
        metadata: {
          order: await this.orderRepo.createOrder(body, session),
        },
      };
    });
  }
}
