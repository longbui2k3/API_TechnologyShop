import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.model';
import { Voucher } from './voucher.model';
import { Product } from './product.model';

const COLLECTION_NAME = 'orders';
export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: {
      totalPrice: { type: Number, required: true, default: 0 },
      totalApplyDiscount: { type: Number, required: true, default: 0 },
      feeShip: { type: Number, required: true, default: 0 },
      total: {
        type: Number,
        required: true,
        default: function () {
          return this.totalPrice - this.totalApplyDiscount + this.feeShip;
        },
      },
    },
    default: {},
  })
  checkout: {
    totalPrice: number;
    totalApplyDiscount: number;
    feeShip: number;
    total: number;
    priceOfProducts: Array<string>;
  };

  @Prop({ type: String, required: true })
  shipping_address: string;

  @Prop({ type: Object, default: {} })
  payment: Object;

  @Prop({ type: String, default: '#0000000000' })
  trackingNumber: string;

  @Prop({ type: Number, default: 0 })
  coin: Number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher' })
  voucher: Voucher;

  @Prop({
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    required: true,
    default: [],
  })
  products: Array<{ product: Product; quantity: Number }>;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'delivered'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Date })
  deliveredDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
