import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { VoucherService } from 'src/services/voucher.service';

@Controller('/api/v1/voucher')
export class VoucherController {
  constructor(private voucherService: VoucherService) {}
  @Post('/')
  @HttpCode(201)
  @UseGuards(AuthenticationGuard)
  async createVoucher(
    @Body()
    body: {
      name: string;
      value: number;
      type: string;
      code: string;
      minimumPayment: number;
      startsAt: Date;
      expiresAt: Date;
      description: string;
      left: number;
      applies_to: { category: string; _id: string };
    },
  ) {
    return await this.voucherService.createVoucher(body);
  }

  @Get('/')
  @HttpCode(200)
  async getAllVouchers(@Query('code') code: string) {
    return await this.voucherService.getAllVouchers(code);
  }

  @Get('/:id/checkIsValid')
  @HttpCode(200)
  async checkVoucherValid(
    @Param('id') id: string,
    @Query('payment') payment: number,
  ) {
    return await this.voucherService.checkVoucherValid(id, payment);
  }
}
