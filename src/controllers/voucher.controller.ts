import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
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

  @Patch('/:id')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async updateVoucher(
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
    @Param('id') id: string,
  ) {
    return await this.voucherService.updateVoucher(id, body);
  }

  @Get('/')
  @HttpCode(200)
  async getAllVouchers(@Query('code') code: string) {
    return await this.voucherService.getAllVouchers(code);
  }

  @Get('/:id')
  @HttpCode(200)
  async getVoucher(@Param('id') id: string) {
    return await this.voucherService.getVoucher(id);
  }

  @Post('/:id/checkIsValid')
  @HttpCode(200)
  async checkVoucherValid(
    @Param('id') id: string,
    @Body() body: { payment: number; products: Array<string> },
  ) {
    return await this.voucherService.checkVoucherValid(
      id,
      body.payment,
      body.products,
    );
  }
}
