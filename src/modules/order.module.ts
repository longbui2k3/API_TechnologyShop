import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from 'src/controllers/order.controller';
import { OrderRepo } from 'src/models/repo/order.repo';
import { OrderSchema } from 'src/models/order.model';
import { OrderService } from 'src/services/order.service';
import { UserSchema } from 'src/models/user.model';
import { UserRepo } from 'src/models/repo/user.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { ProductSchema } from 'src/models/product.model';
import { Cart, CartSchema } from 'src/models/cart.model';
import { CartRepo } from 'src/models/repo/cart.repo';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepo, UserRepo, ProductRepo, CartRepo],
  exports: [OrderService],
})
export class OrderModule {
  constructor() {}
}
