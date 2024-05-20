import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type MeetingDocument = HydratedDocument<Meeting>;
const COLLECTION_NAME = 'meetings';
@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Meeting {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  token: string;
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
