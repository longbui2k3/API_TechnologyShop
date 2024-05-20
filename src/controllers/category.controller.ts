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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RolesGuard } from 'src/auth/authUtils/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
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
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async addCategory(
    @Body() body: { name: string; typeName: string },
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 5000000 })
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
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() body: { name: string },
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '.(png|jpeg|jpg)',
        })
        .addMaxSizeValidator({ maxSize: 5000000 })
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
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
