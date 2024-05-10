import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';

const COLLECTION_NAME = 'comments';
export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Comment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  product: Product;

  @Prop({
    type: String,
    required: true,
  })
  comment: string;

  @Prop({
    type: Number,
    min: [1, 'Rating must be above or equal 1'],
    max: [5, 'Rating must be below or equal 5'],
    default: 1,
  })
  rating: number;

  @Prop({
    type: Number,
    default: 0,
  })
  numberOfLikes: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  usersLiked: Array<User>;

  @Prop({
    type: [{ type: String }],
    default: [],
  })
  images: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
