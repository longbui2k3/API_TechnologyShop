import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseFilePipeBuilder,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RequestModel } from 'src/helpers/requestmodel';
import { UserService } from 'src/services/user.service';

@Controller('/api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async getUserInfo(@Req() req: RequestModel) {
    return await this.userService.getUserInfo(req.user.userId);
  }

  @Patch('profile')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserInfo(
    @Req() req: RequestModel,
    @Body()
    body: {
      name: string;
      gender: string;
      dateOfBirth: Date;
      address: string;
      mobile: string;
    },
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 50000 })
        .build({
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.userService.updateUserInfo({
      userId: req.user.userId,
      bodyUpdate: body,
      file,
    });
  }

  @Patch('password')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async updatePassword(
    @Body()
    body: {
      currentPassword: string;
      newPassword: string;
      newPasswordConfirm: string;
    },
    @Req() req: RequestModel,
  ) {
    return await this.userService.updatePassword({
      userId: req.user.userId,
      ...body,
    });
  }

  @Patch('tokenFirebase')
  @HttpCode(200)
  async updateTokenFirebase(
    @Body()
    body: {
      tokenFirebase: string;
      userId: string;
    },
  ) {
    return await this.userService.updateTokenFirebase(body);
  }
}
