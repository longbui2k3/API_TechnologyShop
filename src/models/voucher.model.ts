import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Product } from './product.model';

const COLLECTION_NAME = 'vouchers';
export type VoucherDocument = HydratedDocument<Voucher>;

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Voucher {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: String, default: 'fixed_amount' }) // percentage
  type: string;

  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: Number, required: true, default: 0 })
  minimumPayment: number;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Number, default: 0 })
  left: number;

  @Prop({
    type: String,
    required: true,
    enum: ['all', 'specificProducts'],
  })
  applies_to: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    default: [],
  })
  applied_products: Product;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
