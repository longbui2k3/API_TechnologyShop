import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from 'src/controllers/product.controller';
import { CategorySchema } from 'src/models/category.model';
import { ProductSchema } from 'src/models/product.model';
import { LaptopSchema } from 'src/models/products/laptop.model';
import { SmartphoneSchema } from 'src/models/products/smartphone.model';
import { CategoryRepo } from 'src/models/repo/category.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { LaptopRepo } from 'src/models/repo/products/laptop.repo';
import { SmartphoneRepo } from 'src/models/repo/products/smartphone.repo';
import ProductFactory from 'src/services/product.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'Laptop', schema: LaptopSchema }]),
    MongooseModule.forFeature([
      { name: 'Smartphone', schema: SmartphoneSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductFactory,
    ProductRepo,
    CategoryRepo,
    LaptopRepo,
    SmartphoneRepo,
  ],
  exports: [ProductFactory],
})
export class ProductModule {
  constructor() {}
}
