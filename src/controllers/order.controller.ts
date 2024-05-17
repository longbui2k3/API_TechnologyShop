import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
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
      payment: { method: string };
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

  @Get('/user')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async findAllOrdersForUser(@Req() req: RequestModel, @Query() query) {
    return await this.orderService.findAllOrdersForUser({
      user: req.user.userId,
      sort: query.sort,
      status: query.status,
    });
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async findAllOrders(@Query() query) {
    return await this.orderService.findAllOrders(query);
  }

  @Patch('/:id/status')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async updateStatusOrders(
    @Param('id') id: string,
    @Body() body: { status: string },
    @Req() req: RequestModel,
  ) {
    return await this.orderService.updateStatusOrders(
      id,
      body.status,
      req.user.userId,
    );
  }
}
