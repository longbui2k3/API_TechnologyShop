import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.model';
const COLLECTION_NAME = 'stores';
export type StoreDocument = HydratedDocument<Store>;

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Store {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  mobile: string;

  @Prop({ type: String })
  introduce: string;

  @Prop({ type: [{ type: String }] })
  images: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user: User;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
