import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from 'src/controllers/product.controller';
import { CategorySchema } from 'src/models/category.model';
import { ProductSchema } from 'src/models/product.model';
import { LaptopSchema } from 'src/models/products/laptop.model';
import { RamSchema } from 'src/models/products/ram.model';
import { CategoryRepo } from 'src/models/repo/category.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { LaptopRepo } from 'src/models/repo/products/laptop.repo';
import { RamRepo } from 'src/models/repo/products/ram.repo';
import ProductFactory from 'src/services/product.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'Ram', schema: RamSchema }]),
    MongooseModule.forFeature([{ name: 'Laptop', schema: LaptopSchema }]),
  ],
  controllers: [ProductController],
  providers: [
    ProductFactory,
    ProductRepo,
    CategoryRepo,
    RamRepo,
    LaptopRepo,
  ],
  exports: [ProductFactory],
})
export class ProductModule {
  constructor() {}
}
