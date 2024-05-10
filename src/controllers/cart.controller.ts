import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RequestModel } from 'src/helpers/requestmodel';
import { CartService } from 'src/services/cart.service';

@Controller('/api/v1/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('/')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async getAllCarts(@Req() req: RequestModel) {
    return this.cartService.getAllCarts({ userId: req.user.userId });
  }

  @Post('/')
  @HttpCode(201)
  @UseGuards(AuthenticationGuard)
  async addToCart(
    @Req() req: RequestModel,
    @Body() body: { product: string; quantity: number },
  ) {
    return await this.cartService.addToCart({
      userId: req.user.userId,
      productId: body.product,
      quantity: body.quantity,
    });
  }

  @Patch('/quantity')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async updateQuantityCart(
    @Req() req: RequestModel,
    @Body() body: { product: string; quantity: number },
  ) {
    return await this.cartService.updateQuantityCart({
      userId: req.user.userId,
      productId: body.product,
      quantity: body.quantity,
    });
  }

  @Patch('/item')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async removeItemFromCart(
    @Req() req: RequestModel,
    @Body() body: { product: string },
  ) {
    return await this.cartService.removeItemFromCart({
      userId: req.user.userId,
      productId: body.product,
    });
  }

  @Patch('/items')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async removeItemsFromCart(
    @Req() req: RequestModel,
    @Body() body: { products: string[] },
  ) {
    return await this.cartService.removeItemsFromCart({
      userId: req.user.userId,
      productIds: body.products,
    });
  }

  @Patch('/allitems')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async removeAllItemsFromCart(@Req() req: RequestModel) {
    return await this.cartService.removeAllItemsFromCart({
      userId: req.user.userId,
    });
  }
}
