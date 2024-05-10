import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
const COLLECTION_NAME = 'categories';
export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Category {
  @Prop({
    type: String,
  })
  image: string;
  @Prop({
    type: String,
    required: true,
  })
  typeName: string;

  @Prop({
    type: String,
    required: [true, 'Please provide your name!'],
  })
  name: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
