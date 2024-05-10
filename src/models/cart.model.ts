import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';
const COLLECTION_NAME = 'carts';
export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;
  @Prop({
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          validate: {
            validator: function (num: number) {
              return num > 0;
            },
            message: 'Number must be above or equal 0!',
          },
        },
      },
    ],
    default: [],
  })
  items: Array<{ product: Product; quantity: number }>;
}
export const CartSchema = SchemaFactory.createForClass(Cart);
