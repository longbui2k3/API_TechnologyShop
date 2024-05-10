import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from 'src/services/category.service';

@Controller('/api/v1/category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/')
  @HttpCode(200)
  async getAllCategories() {
    const categories = await this.categoryService.getAllCategories();
    return categories;
  }

  @Get('/:id')
  @HttpCode(200)
  async getCategory(@Param('id') id: string) {
    const category = await this.categoryService.getCategory(id);
    return category;
  }

  @Post('/')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('image'))
  async addCategory(
    @Body() body: { name: string; typeName: string },
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 300000 })
        .build({
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.categoryService.addCategory(body, file);
  }

  @Patch('/:id')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name: string },
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        })
        .addMaxSizeValidator({ maxSize: 50000 })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.categoryService.updateCategory(body, file, id);
  }

  @Delete('/:id')
  @HttpCode(200)
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
