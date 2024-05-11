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
    type: String,
    required: true,
  })
  brand: string;

  @Prop({
    type: String,
    // required: true,
    default: function () {
      return `${this.images[0] || ''}`;
    },
  })
  thumb: string;

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
    type: String,
    required: true,
  })
  price: string;

  @Prop({
    type: String,
  })
  infomations: string;

  @Prop({
    type: [{ type: { detailMoreInfoInnerText: String, subInnerText: String } }],
    default: [],
  })
  extraInfo: Array<{ detailMoreInfoInnerText: string; subInnerText: string }>;

  @Prop({
    type: [{ type: { label: String, variants: [{ type: String }] } }],
    default: [],
  })
  variants: Array<{ label: String; variants: Array<String> }>;

  @Prop({
    type: String,
    enum: ['ram', 'laptop', 'smartphone'],
  })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    ref: function () {
      return this.type;
    },
  })
  description: mongoose.Schema.Types.Mixed;

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
  left: number;

  @Prop({
    type: Number,
    default: 0,
  })
  views: Number;

  @Prop({
    type: Number,
    min: [1, 'Rating must be above or equal 1'],
    max: [5, 'Rating must be below or equal 5'],
    default: 1.0,
  })
  rating: Number;
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
