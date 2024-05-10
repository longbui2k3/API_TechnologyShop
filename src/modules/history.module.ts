import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryController } from 'src/controllers/history.controller';
import { ProductSchema } from 'src/models/product.model';
import { HistorySchema } from 'src/models/history.model';
import { ProductRepo } from 'src/models/repo/product.repo';
import { HistoryRepo } from 'src/models/repo/history.repo';
import { UserRepo } from 'src/models/repo/user.repo';
import { UserSchema } from 'src/models/user.model';
import { HistoryService } from 'src/services/history.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'History', schema: HistorySchema },
    ]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [HistoryController],
  providers: [
    HistoryService,
    HistoryRepo,
    ProductRepo,
    UserRepo,
  ],
  exports: [HistoryService],
})
export class HistoryModule {
  constructor() {}
}
