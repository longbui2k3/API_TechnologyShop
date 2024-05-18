import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticController } from 'src/controllers/statistic.controller';
import { OrderSchema } from 'src/models/order.model';
import { OrderRepo } from 'src/models/repo/order.repo';
import { StatisticService } from 'src/services/statistic.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [StatisticController],
  providers: [StatisticService, OrderRepo],
  exports: [StatisticService],
})
export class StatisticModule {
  constructor() {}
}
