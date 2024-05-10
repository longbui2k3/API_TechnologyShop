import { Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema, Types } from 'mongoose';
import { KeyToken } from 'src/models/keytoken.model';

@Injectable()
export class KeyTokenService {

  constructor(@InjectModel('KeyToken')
  private keytokenModel: Model<KeyToken>) {}
  async createKeyToken(body: {
    userId: Types.ObjectId;
    publicKey: string;
    privateKey: string;
    refreshToken?: string;
  }) {
    try {
      const filter = { user: body.userId };
      const update = {
        publicKey: body.publicKey,
        privateKey: body.privateKey,
        refreshTokenUsed: [],
        refreshToken: body.refreshToken,
      };
      const options = {
        upsert: true,
        new: true,
      };
      const tokens = await this.keytokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );
      console.log(tokens);

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }
  async findByUserId(userId) {
    console.log(this.keytokenModel);
    return await this.keytokenModel
      .findOne({
        user: new Types.ObjectId(userId),
      })
      .lean();
  }
  async removeKeyById(id) {
    return await this.keytokenModel
      .deleteOne({
        _id: new Types.ObjectId(id),
      })
      .lean();
  }
}
