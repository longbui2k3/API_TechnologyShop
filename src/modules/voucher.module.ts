import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherController } from 'src/controllers/voucher.controller';
import { ProductSchema } from 'src/models/product.model';
import { ProductRepo } from 'src/models/repo/product.repo';
import { VoucherRepo } from 'src/models/repo/voucher.repo';
import { Voucher, VoucherSchema } from 'src/models/voucher.model';
import { VoucherService } from 'src/services/voucher.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Voucher', schema: VoucherSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [VoucherController],
  providers: [VoucherService, VoucherRepo, ProductRepo],
  exports: [VoucherService],
})
export class VoucherModule {
  constructor() {}
}
