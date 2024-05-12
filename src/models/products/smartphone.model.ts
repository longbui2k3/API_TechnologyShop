import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SmartphoneDocument = HydratedDocument<Smartphone>;
const COLLECTION_NAME = 'smartphones';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Smartphone {
  @Prop({ type: String })
  screen: string;

  @Prop({ type: String })
  operating_system: string;

  @Prop({ type: String })
  front_camera: string;

  @Prop({ type: String })
  rear_camera: string;

  @Prop({ type: String })
  chip: string;

  @Prop({ type: String })
  ram: string;

  @Prop({ type: String })
  storage: string;

  @Prop({ type: String })
  sim: string;

  @Prop({ type: String })
  battery: string;

  @Prop({ type: String })
  brand: string;
}

export const SmartphoneSchema = SchemaFactory.createForClass(Smartphone);
