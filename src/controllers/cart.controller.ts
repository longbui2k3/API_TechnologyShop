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
import { RolesGuard } from 'src/auth/authUtils/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RequestModel } from 'src/helpers/requestmodel';
import { CartService } from 'src/services/cart.service';

@Controller('/api/v1/cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get('/')
  @HttpCode(200)
  @Roles(Role.User)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getAllCarts(@Req() req: RequestModel) {
    return this.cartService.getAllCarts({ userId: req.user.userId });
  }

  @Post('/')
  @HttpCode(201)
  @Roles(Role.User)
  @UseGuards(AuthenticationGuard, RolesGuard)
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
  @Roles(Role.User)
  @UseGuards(AuthenticationGuard, RolesGuard)
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
  @Roles(Role.User)
  @UseGuards(AuthenticationGuard, RolesGuard)
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
  @Roles(Role.User)
  @UseGuards(AuthenticationGuard, RolesGuard)
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
  @Roles(Role.User)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async removeAllItemsFromCart(@Req() req: RequestModel) {
    return await this.cartService.removeAllItemsFromCart({
      userId: req.user.userId,
    });
  }
}
