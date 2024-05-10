import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LaptopDocument = HydratedDocument<Laptop>;
const COLLECTION_NAME = 'laptops';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Laptop {
  @Prop({
    type: String,
    required: true,
  })
  status: string;
  
  @Prop({
    type: String,
    required: true,
  })
  warrantyPolicy: string;

  @Prop({
    type: String,
    required: true,
  })
  origin: string;

  @Prop({
    type: String,
    required: true,
  })
  usage_info: string;

  @Prop({
    type: String,
  })
  graphics_card: string;

  @Prop({
    type: String,
  })
  ram_capacity: string;

  @Prop({
    type: String,
  })
  ram_type: string;

  @Prop({
    type: String,
  })
  ram_slots: string;

  @Prop({
    type: String,
  })
  hard_drive: string;

  @Prop({
    type: String,
  })
  screen_size: string;

  @Prop({
    type: String,
  })
  screen_technology: string;

  @Prop({
    type: String,
  })
  battery: string;

  @Prop({
    type: String,
  })
  operating_system: string;

  @Prop({
    type: String,
  })
  screen_resolution: string;

  @Prop({
    type: String,
  })
  port: string;
}

export const LaptopSchema = SchemaFactory.createForClass(Laptop);
