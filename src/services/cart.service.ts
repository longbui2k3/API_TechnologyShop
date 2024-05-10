import { Injectable } from '@nestjs/common';
import { CartRepo } from 'src/models/repo/cart.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { UserRepo } from 'src/models/repo/user.repo';

@Injectable()
export class CartService {
  constructor(
    private cartRepo: CartRepo,
    private userRepo: UserRepo,
    private productRepo: ProductRepo,
  ) {}
  async getAllCarts(body: { userId: string }) {
    const checkUserExists = await this.userRepo.checkUserExists(body.userId);
    return {
      message: 'Get carts successfully!',
      status: 200,
      metadata: {
        cart: await this.cartRepo.getAllCarts({
          userId: body.userId,
          unselect: ['__v', 'createdAt', 'updatedAt'],
        }),
      },
    };
  }
  async addToCart(body: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    const checkUserExists = await this.userRepo.checkUserExists(body.userId);
    const checkProductExists = await this.productRepo.checkProductExists(
      body.productId,
    );

    return {
      message: 'Add to cart successfully!',
      status: 200,
      metadata: {
        cart: await this.cartRepo.addToCart(body),
      },
    };
  }
  async updateQuantityCart(body: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    const checkUserExists = await this.userRepo.checkUserExists(body.userId);
    const checkProductExists = await this.productRepo.checkProductExists(
      body.productId,
    );

    return {
      message: 'Update cart successfully!',
      status: 200,
      metadata: {
        cart: await this.cartRepo.updateQuantityCart(body),
      },
    };
  }
  async removeItemFromCart(body: { userId: string; productId: string }) {
    const checkUserExists = await this.userRepo.checkUserExists(body.userId);
    const checkProductExists = await this.productRepo.checkProductExists(
      body.productId,
    );

    return {
      message: 'Remove selected product from cart successfully!',
      status: 200,
      metadata: {
        cart: await this.cartRepo.removeItemFromCart(body),
      },
    };
  }

  async removeItemsFromCart(body: { userId: string; productIds: string[] }) {
    const checkUserExists = await this.userRepo.checkUserExists(body.userId);
    const checkItemsExists = await Promise.all(
      body.productIds.map(async (productId: string) => {
        const checkItemExists = await this.cartRepo.checkItemExists({
          userId: body.userId,
          productId,
        });
        return checkItemExists;
      }),
    );
    return {
      message: 'Remove selected products from cart successfully!',
      status: 200,
      metadata: {
        cart: await this.cartRepo.removeItemsFromCart(body),
      },
    };
  }

  async removeAllItemsFromCart(body: { userId: string }) {
    const checkUserExists = await this.userRepo.checkUserExists(body.userId);
    return {
      message: 'Remove all products from cart successfully!',
      status: 200,
      metadata: {
        cart: await this.cartRepo.removeAllItemsFromCart(body),
      },
    };
  }
}
