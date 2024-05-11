import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SmartphoneDocument = HydratedDocument<Smartphone>;
const COLLECTION_NAME = 'smartphones';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Smartphone {
  @Prop({ type: String })
  technology: string;

  @Prop({ type: String })
  dimensions: string;

  @Prop({ type: String })
  weight: string;

  @Prop({ type: String })
  display: string;

  @Prop({ type: String })
  resolution: string;

  @Prop({ type: String })
  os: string;

  @Prop({ type: String })
  chipset: string;

  @Prop({ type: String })
  cpu: string;

  @Prop({ type: String })
  internal: string;

  @Prop({ type: String })
  camera: string;
}

export const SmartphoneSchema = SchemaFactory.createForClass(Smartphone);
