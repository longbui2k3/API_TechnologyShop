import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticController } from 'src/controllers/statistic.controller';
import { OrderSchema } from 'src/models/order.model';
import { ProductSchema } from 'src/models/product.model';
import { OrderRepo } from 'src/models/repo/order.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { StatisticService } from 'src/services/statistic.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [StatisticController],
  providers: [StatisticService, OrderRepo, ProductRepo],
  exports: [StatisticService],
})
export class StatisticModule {
  constructor() {}
}
