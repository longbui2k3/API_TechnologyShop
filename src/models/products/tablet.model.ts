import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TabletDocument = HydratedDocument<Tablet>;
const COLLECTION_NAME = 'tablets';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Tablet {
  @Prop({ type: String })
  screen: string;

  @Prop({ type: String })
  operating_system: string;

  @Prop({ type: String })
  chip: string;

  @Prop({ type: String })
  ram: string;

  @Prop({ type: String })
  storage: string;

  @Prop({ type: String })
  connect: string;

  @Prop({ type: String })
  front_camera: string;

  @Prop({ type: String })
  rear_camera: string;

  @Prop({ type: String })
  battery: string;

  @Prop({ type: String })
  brand: string;
}

export const TabletSchema = SchemaFactory.createForClass(Tablet);
