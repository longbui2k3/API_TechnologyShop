import { Injectable } from '@nestjs/common';
import { UserRepo } from 'src/models/repo/user.repo';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepo) {}
  async getUserInfo(userId: string) {
    const checkUserExists = await this.userRepo.checkUserExists(userId);
    return {
      message: 'Get user information successfully!',
      status: 200,
      metadata: {
        user: await this.userRepo.getUserInfo(userId, [
          '_id',
          'name',
          'email',
          'avatar',
          'role',
          'address',
          'dateOfBirth',
          'mobile',
          'gender',
        ]),
      },
    };
  }
  async updateUserInfo(params: {
    userId: string;
    bodyUpdate: {
      name: string;
      gender: string;
      dateOfBirth: Date;
      address: string;
      mobile: string;
    };
    file: Express.Multer.File;
  }) {
    return {
      status: 200,
      message: 'Update user successfully!',
      metadata: {
        user: await this.userRepo.updateUserInfo({
          userId: params.userId,
          bodyUpdate: params.bodyUpdate,
          file: params.file,
          filter: [
            'name',
            'email',
            'avatar',
            'address',
            'dateOfBirth',
            'gender',
            'mobile',
          ],
        }),
      },
    };
  }
  async updatePassword(params: {
    userId: string;
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
  }) {
    await this.userRepo.updatePassword(params);
    return {
      status: 200,
      metadata: 'Update password successfullly',
    };
  }
  async updateTokenFirebase(body: { tokenFirebase: string; userId: string }) {
    const checkUserExists = await this.userRepo.checkUserExists(body.userId);

    return {
      status: 200,
      message: 'Updata token firebase successfully!',
      metadata: {
        user: await this.userRepo.updateTokenFirebase(body),
      },
    };
  }
}
