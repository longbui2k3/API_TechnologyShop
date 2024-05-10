import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';
export type HistoryDocument = HydratedDocument<History>;
const COLLECTION_NAME = 'histories';
@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class History {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: [
      {
        type: {
          product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          viewedAt: { type: Date, default: Date.now() },
        },
      },
    ],
    default: [],
  })
  viewedProducts: Array<{ product: Product; viewedAt: Date }>;

  @Prop({
    type: Array,
    default: [],
  })
  searchedWords: Array<string>;
}

export const HistorySchema = SchemaFactory.createForClass(History);
