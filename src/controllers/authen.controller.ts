import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RequestModel } from 'src/helpers/requestmodel';
import { AuthenService } from 'src/services/authen.service';

@Controller('/api/v1/')
export class AuthenController {
  constructor(private authenService: AuthenService) {}

  @Post('signup')
  signUp(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      passwordConfirm: string;
      role: string;
    },
  ) {
    return this.authenService.signUp(body);
  }

  @Post('verify')
  verifyOTP(
    @Query('type') type: string,
    @Body()
    body: {
      email: string;
      OTP: string;
    },
  ) {
    return this.authenService.verifyOTP({
      type,
      email: body.email,
      OTP: body.OTP,
    });
  }

  @Post('login')
  @HttpCode(200)
  logIn(@Body() body: { email: string; password: string }) {
    return this.authenService.logIn(body);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  logout(@Req() req: RequestModel) {
    return this.authenService.logOut(req.keyStore);
  }

  @Post('forgotPassword')
  @HttpCode(200)
  forgotPassWord(@Body() body: { email: string }) {
    return this.authenService.forgotPassword(body);
  }

  @Post('resetPassword/:token')
  resetPassword(
    @Body() body: { password: string; passwordConfirm: string },
    @Param('token') token: string,
  ) {
    return this.authenService.resetPassword(body, token);
  }
}
