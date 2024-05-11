import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RequestModel } from 'src/helpers/requestmodel';
import { OrderService } from 'src/services/order.service';

@Controller('/api/v1/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/')
  @HttpCode(201)
  @UseGuards(AuthenticationGuard)
  async createOrder(
    @Req() req: RequestModel,
    @Body()
    body: {
      checkout: {
        totalPrice: number;
        totalApplyDiscount: number;
        feeShip: number;
        total: number;
      };
      shipping_address: string;
      payment: string;
      coin: number;
      voucher: string;
      products: Array<{ product: string; quantity: number }>;
      phone: string;
    },
  ) {
    return await this.orderService.createOrder({
      ...body,
      user: req.user.userId,
    });
  }
}
