import { InjectModel } from '@nestjs/mongoose';
import { Cart } from '../cart.model';
import { Model } from 'mongoose';
import { convertToObjectId, getSelectData, getUnselectData } from 'src/utils';
import { BadRequestException } from '@nestjs/common';

export class CartRepo {
  constructor(@InjectModel('Cart') private cartModel: Model<Cart>) {}

  async checkItemExists(body: { userId: string; productId: string }) {
    const cart = await this.cartModel.findOne({
      user: body.userId,
      'items.product': body.productId,
    });
    if (!cart) {
      throw new BadRequestException(
        "Product doesn't exist in the cart! Please add to cart!",
      );
    }
  }

  async getAllCarts(body: { userId: string; unselect: Array<string> }) {
    return await this.cartModel
      .findOne({ user: body.userId })
      .select(getUnselectData(body.unselect))
      .populate({ path: 'items.product' });
  }

  async addToCart(body: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    let cart = await this.cartModel.findOne({
      user: body.userId,
      'items.product': body.productId,
    });
    // chưa có cart
    if (!cart) {
      cart = await this.cartModel.findOneAndUpdate(
        { user: body.userId },
        {
          $addToSet: {
            items: { product: body.productId, quantity: body.quantity },
          },
        },
        { new: true, upsert: true },
      );
      return cart;
    }

    cart = await this.cartModel.findOneAndUpdate(
      {
        user: body.userId,
        'items.product': body.productId,
      },
      {
        $set: {
          'items.$.product': body.productId,
        },
        $inc: {
          'items.$.quantity': body.quantity,
        },
      },
      { new: true, upsert: true },
    );
    return cart;
  }

  async updateQuantityCart(body: {
    userId: string;
    productId: string;
    quantity: number;
  }) {
    let cart = await this.cartModel.findOne({
      user: body.userId,
      'items.product': body.productId,
    });
    // chưa có cart
    if (!cart) {
      cart = await this.cartModel.findOneAndUpdate(
        { user: body.userId },
        {
          $addToSet: {
            items: { product: body.productId, quantity: body.quantity },
          },
        },
        { new: true, upsert: true },
      );
      return cart;
    }
    cart = await this.cartModel.findOneAndUpdate(
      {
        user: body.userId,
        'items.product': body.productId,
      },
      {
        $set: {
          'items.$.product': body.productId,
          'items.$.quantity': body.quantity,
        },
      },
      { new: true },
    );
    return cart;
  }

  async removeItemFromCart(body: { userId: string; productId: string }) {
    const checkItemExists = await this.checkItemExists(body);
    const cart = await this.cartModel.findOneAndUpdate(
      { user: body.userId },
      {
        $pull: {
          items: { product: body.productId },
        },
      },
      { new: true },
    );
    return cart;
  }

  async removeItemsFromCart(body: {
    userId: string;
    productIds: Array<string>;
  }) {
    
    const cart = await this.cartModel.findOneAndUpdate(
      { user: body.userId },
      {
        $pull: {
          items: { product: { $in: body.productIds } },
        },
      },
      { new: true },
    );
    return cart;
  }

  async removeAllItemsFromCart(body: { userId: string }) {
    const cart = await this.cartModel.findOneAndUpdate(
      { user: body.userId },
      {
        items: [],
      },
      { new: true },
    );
    return cart;
  }
}
