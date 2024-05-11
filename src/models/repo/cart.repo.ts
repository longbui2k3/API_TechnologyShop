import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Cart } from '../cart.model';
import { ClientSession, Connection, Model } from 'mongoose';
import { convertToObjectId, getSelectData, getUnselectData } from 'src/utils';
import { BadRequestException } from '@nestjs/common';
import { transaction } from 'src/helpers/transaction';
import { Session } from 'inspector';

export class CartRepo {
  constructor(
    @InjectModel('Cart') private cartModel: Model<Cart>,
    @InjectConnection() private connection: Connection,
  ) {}

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

  async addToCart(
    body: {
      userId: string;
      productId: string;
      quantity: number;
    },
    session: ClientSession,
  ) {
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
        { new: true, upsert: true, session },
      );
      return cart;
    }

    cart = await this.cartModel
      .findOneAndUpdate(
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
        { new: true, upsert: true, session },
      )
      .populate({ path: 'items.product' });
    const selectedProduct = cart.items.find(
      (product) => product.product._id.toString() === body.productId,
    );
    console.log(selectedProduct.quantity);
    console.log(selectedProduct.product.left);
    if (selectedProduct.quantity > selectedProduct.product.left) {
      throw new BadRequestException(
        'The quantity of product in store is not enough to order!',
      );
    }
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

  async removeItemsFromCart(
    body: {
      userId: string;
      productIds: Array<string>;
    },
    session?: ClientSession,
  ) {
    const cart = await this.cartModel.findOneAndUpdate(
      { user: body.userId },
      {
        $pull: {
          items: { product: { $in: body.productIds } },
        },
      },
      { new: true, session },
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
