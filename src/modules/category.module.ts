import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategoryController } from "src/controllers/category.controller";
import { CategorySchema } from "src/models/category.model";
import { CategoryRepo } from "src/models/repo/category.repo";
import { CategoryService } from "src/services/category.service";


@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo],
  exports: [CategoryService]
})
export class CategoryModule {
  constructor() {}
}
