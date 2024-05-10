import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RamDocument = HydratedDocument<Ram>;
const COLLECTION_NAME = 'rams';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Ram {
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
  capacity: string;

  @Prop({
    type: String,
  })
  bus: string;

  @Prop({
    type: String,
  })
  support: string;

  @Prop({
    type: String,
  })
  timing: string;

  @Prop({
    type: String,
  })
  voltage: string;

  @Prop({
    type: String,
  })
  manufacturer: string;
}

export const RamSchema = SchemaFactory.createForClass(Ram);
