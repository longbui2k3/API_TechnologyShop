import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Category } from './category.model';
export type UserDocument = HydratedDocument<Product>;
const COLLECTION_NAME = 'products';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Product {
  @Prop({
    type: String,
    required: true,
  })
  name: string;
  @Prop({
    type: [{ type: String }],
  })
  images: string[];

  @Prop({
    type: String,
    default: null,
  })
  linkytb: string;

  @Prop({
    type: Number,
    required: true,
  })
  price: Number;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
    enum: ['ram'],
  })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    ref: function () {
      return this.type;
    },
  })
  attributes: mongoose.Schema.Types.Mixed;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  category: Category;

  @Prop({
    type: Number,
    default: 0,
  })
  sold: Number;

  @Prop({
    type: Number,
    default: 0,
  })
  views: Number;
  // @Prop({
  //   type: Date,
  // })
  // expiresAt: Date;

  // @Prop({
  //   type: Date,
  // })
  // createdAt: Date;
  // @Prop({
  //   type: String,
  //   default: 'accepted-pending',
  //   enum: [
  //     'showing',
  //     'expired',
  //     'rejected',
  //     'accepted-pending',
  //     'payment-pending',
  //     'hidden',
  //   ],
  // })
  // status: string;
}
// const expiredDate = 60 * 24 * 60 * 60 * 1000; // 60 days
export const ProductSchema = SchemaFactory.createForClass(Product);
// ProductSchema.pre('save', function (next) {
//   this.expiresAt = new Date(this.createdAt.getTime() + expiredDate);
//   next();
// });
