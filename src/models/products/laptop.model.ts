import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LaptopDocument = HydratedDocument<Laptop>;
const COLLECTION_NAME = 'laptops';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Laptop {
  @Prop({ type: String })
  cpu: string;

  @Prop({ type: String })
  ram: string;

  @Prop({
    type: String,
  })
  hard_drive: string;

  @Prop({
    type: String,
  })
  screen: string;

  @Prop({
    type: String,
  })
  graphics_card: string;

  @Prop({
    type: String,
  })
  port: string;

  @Prop({
    type: String,
  })
  operating_system: string;

  @Prop({ type: String })
  design: string;

  @Prop({ type: String })
  size: string;

  @Prop({ type: String })
  released_date: string;
}

export const LaptopSchema = SchemaFactory.createForClass(Laptop);
