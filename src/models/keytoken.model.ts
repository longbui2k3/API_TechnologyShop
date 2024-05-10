import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.model';

export type KeyTokenDocument = mongoose.HydratedDocument<KeyToken>;
const COLLECTION_NAME = 'keys';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class KeyToken {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user: User;

  @Prop({
    type: String,
    required: true,
  })
  privateKey: string;

  @Prop({
    type: String,
    required: true,
  })
  publicKey: string;

  @Prop({
    type: Array,
    default: [],
  })
  refreshTokensUsed: [];

  @Prop({
    type: String,
    required: true,
  })
  refreshToken: string;
}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken);
