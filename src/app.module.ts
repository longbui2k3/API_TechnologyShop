import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenModule } from './modules/authen.module';
import { MongoModule } from './modules/mongo.module';
import { KeyTokenModule } from './modules/keytoken.module';
import { UserModule } from './modules/user.module';
import { CategoryModule } from './modules/category.module';
import { ProductModule } from './modules/product.module';
import { CartModule } from './modules/cart.module';
import { HistoryModule } from './modules/history.module';
import { StoreModule } from './modules/store.module';
import { CommentModule } from './modules/comment.module';
import { OrderModule } from './modules/order.module';
import { VoucherModule } from './modules/voucher.module';
import { StatisticModule } from './modules/statistic.module';

@Module({
  imports: [
    MongoModule.forRootAsync(),
    AuthenModule,
    KeyTokenModule,
    UserModule,
    CategoryModule,
    ProductModule,
    CartModule,
    HistoryModule,
    StoreModule,
    CommentModule,
    OrderModule,
    VoucherModule,
    StatisticModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
