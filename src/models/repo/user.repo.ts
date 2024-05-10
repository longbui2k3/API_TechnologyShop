import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadFiles } from 'src/utils/uploadFiles';
import { User } from '../user.model';
import { getSelectData } from 'src/utils';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
export class UserRepo {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getUserInfo(userId: string, select: Array<string> = []) {
    return await this.userModel.findById(userId).select(getSelectData(select));
  }

  async checkUserExists(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(`User with id ${userId} is not found!`);
    }
    return user;
  }
  async updateTokenFirebase(body: { tokenFirebase: string; userId: string }) {
    return await this.userModel.findByIdAndUpdate(
      body.userId,
      {
        tokenFirebase: body.tokenFirebase,
      },
      { new: true },
    );
  }
  async updateUserInfo({ userId, bodyUpdate, file, filter = [] }) {
    const { name, gender, dateOfBirth, address, mobile } = bodyUpdate;
    const avatar = await new UploadFiles(
      'users',
      'image',
      file,
    ).uploadFileAndDownloadURL();
    return await this.userModel
      .findByIdAndUpdate(
        userId,
        { name, gender, dateOfBirth, avatar, address, mobile },
        { new: true },
      )
      .select(getSelectData(filter));
  }

  async updatePassword({
    userId,
    currentPassword,
    newPassword,
    newPasswordConfirm,
  }) {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user.matchPassword(currentPassword)) {
      throw new UnauthorizedException('Incorrect password!');
    }

    if (newPassword !== newPasswordConfirm) {
      throw new BadRequestException(
        'New passwords do not match! Please try again!',
      );
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
  }
}
