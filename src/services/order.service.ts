import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { transaction } from 'src/helpers/transaction';
import { CartRepo } from 'src/models/repo/cart.repo';
import { OrderRepo } from 'src/models/repo/order.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { UserRepo } from 'src/models/repo/user.repo';
import { VoucherRepo } from 'src/models/repo/voucher.repo';
import { changePriceFromStringToNumber } from 'src/utils';
const COINTOUSD = 1000;
@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepo,
    private userRepo: UserRepo,
    private productRepo: ProductRepo,
    private cartRepo: CartRepo,
    private voucherRepo: VoucherRepo,
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
    payment: { method: string };
    coin: number;
    voucher: string;
    products: Array<{ product: string; quantity: number }>;
    phone: string;
  }) {
    return await transaction(this.connection, async (session) => {
      // Kiem tra ng dung ton tai
      const checkUserExists = await this.userRepo.checkUserExists(body.user);

      // Kiem tra order co san pham nao khong
      if (body.products.length === 0) {
        throw new BadRequestException("Order doesn't have any products!");
      }

      // Kiem tra product ton tai
      const checkExistedProducts = await Promise.all(
        body.products.map(async (product) => {
          const checkProductExists = await this.productRepo.checkProductExists(
            product.product,
          );
          return checkProductExists;
        }),
      );

      // Kiem tra total price
      const totalPrice = checkExistedProducts
        .map(
          (product, i) =>
            changePriceFromStringToNumber(product.sale_price) *
            body.products[i].quantity,
        )
        .reduce((a, b) => a + b, 0);
      if (totalPrice !== body.checkout.totalPrice) {
        throw new BadRequestException('Total price is not correct!');
      }

      // Kiem tra total apply discount
      let totalApplyDiscount = 0;
      if (body.voucher) {
        // Kiem tra voucher ton tai
        const voucher = await this.voucherRepo.checkVoucherExists(body.voucher);

        // Kiem tra voucher hợp lệ
        const isValidVoucher = await this.voucherRepo.checkVoucherValid(
          body.voucher,
          body.checkout.total,
          body.products.map((product) => product.product),
        );
        if (!isValidVoucher) {
          throw new BadRequestException('Voucher is not valid!');
        }

        if (voucher.type === 'fixed_amount') {
          totalApplyDiscount = voucher.value + body.coin;
        } else if (voucher.type === 'percentage') {
          const applied_products = [];
          body.products.forEach((product) => {
            if (
              voucher.applied_products
                .map((product) => product._id.toString())
                .includes(product.product)
            ) {
              applied_products.push({
                id: product.product,
                quantity: product.quantity,
              });
            }
          });
          const totalPriceAppliedVoucher = applied_products
            .map(({ id, quantity }) => {
              const product = checkExistedProducts.find(
                (product) => product._id.toString() === id,
              );
              return (
                changePriceFromStringToNumber(product.sale_price) * quantity
              );
            })
            .reduce((a, b) => a + b, 0);
          totalApplyDiscount =
            Math.floor((totalPriceAppliedVoucher * voucher.value) / 100) +
            body.coin * COINTOUSD;
        }
      }

      if (totalApplyDiscount !== body.checkout.totalApplyDiscount) {
        throw new BadRequestException('Total apply discount is not correct!');
      }

      // kiem tra total có = totalPrice - totalApplyDiscount + feeShip
      if (
        body.checkout.totalPrice -
          body.checkout.totalApplyDiscount +
          body.checkout.feeShip !==
        body.checkout.total
      ) {
        throw new BadRequestException('Total is not correct!');
      }

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

  async findAllOrdersForUser(query: {
    user: string;
    sort: string;
    status: string;
  }) {
    const checkUserExists = await this.userRepo.checkUserExists(query.user);

    return {
      message: 'Find all orders for user successfully!',
      status: 200,
      metadata: {
        orders: await this.orderRepo.findAllOrdersForUser(query),
      },
    };
  }

  async findAllOrders(query: { sort: string; status: string }) {
    return {
      message: 'Find all orders successfully!',
      status: 200,
      metadata: {
        orders: await this.orderRepo.findAllOrders(query),
      },
    };
  }

  async updateStatusOrders(order: string, status: string, user: string) {
    const checkOrderExists = await this.orderRepo.checkOrderExists(order);

    const checkUserExists = await this.userRepo.checkUserExists(user);

    const statuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
    const index = statuses.indexOf(status);
    if (index < 0) {
      throw new BadRequestException('Status is not valid!');
    }

    if (
      statuses.indexOf(checkOrderExists.status) + 1 !== index &&
      index !== statuses.length - 1
    ) {
      throw new BadRequestException(
        `Update status failed! Order must be in ${statuses[index - 1]} status`,
      );
    }

    switch (checkUserExists.role) {
      case 'user':
        if (status !== 'cancelled') {
          throw new UnauthorizedException(
            `User doesn't have permission to change order status to ${status}`,
          );
        }
        break;
      case 'admin':
        if (status !== 'confirmed' && status !== 'delivered') {
          throw new UnauthorizedException(
            `Admin doesn't have permission to change order status to ${status}`,
          );
        }
    }

    if (status === 'cancelled') {
      if (
        Date.now() - new Date(checkOrderExists.createdAt).getTime() >
        1000 * 60 * 30
      ) {
        throw new BadRequestException(
          'Order can not be cancelled after 30 minutes',
        );
      }
    }

    if (status === 'delivered') {
      await Promise.all(
        checkOrderExists.products.map(async (product) => {
          await this.productRepo.updateSoldOfProduct({
            id: product.product._id,
            sold: product.quantity,
          });
        }),
      );
      await this.orderRepo.updateDeliveredDate(order);
    }

    return {
      message: 'Update status of order successfully!',
      status: 200,
      metadata: {
        order: await this.orderRepo.updateStatusOrders(order, status),
      },
    };
  }
}
