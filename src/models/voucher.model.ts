import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from './product.model';

const COLLECTION_NAME = 'vouchers';
export type VoucherDocument = HydratedDocument<Voucher>;

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Voucher {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: String, default: 'fixed_amount' }) // percentage
  type: string;

  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: (value: number) => {
        return value > 0;
      },
      message: 'Minimum payment must be greater than or equal to 0',
    },
  })
  minimumPayment: number;

  @Prop({ type: Date, required: true })
  startsAt: Date;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: String })
  description: string;

  @Prop({
    type: Number,
    default: 0,
    validate: {
      validator: (value: number) => {
        return value > 0;
      },
      message: 'Left must be greater than or equal to 0',
    },
  })
  left: number;

  @Prop({
    type: Object,
    required: true,
  })
  applies_to: Object;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  applied_products: Array<Product>;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
