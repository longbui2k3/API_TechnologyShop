import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from 'src/controllers/cart.controller';
import { CartSchema } from 'src/models/cart.model';
import { ProductSchema } from 'src/models/product.model';
import { CartRepo } from 'src/models/repo/cart.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { UserRepo } from 'src/models/repo/user.repo';
import { UserSchema } from 'src/models/user.model';
import { CartService } from 'src/services/cart.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService, CartRepo, UserRepo, ProductRepo],
  exports: [CartService],
})
export class CartModule {
  constructor(private cartService: CartService) {}
}
