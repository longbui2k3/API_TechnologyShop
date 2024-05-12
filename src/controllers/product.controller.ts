import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import ProductFactory, { ProductService } from 'src/services/product.service';

@Controller('/api/v1/product')
export class ProductController {
  constructor(private productFactory: ProductFactory) {}

  @Post('/')
  @HttpCode(201)
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FilesInterceptor('images', 6))
  async addProduct(
    @Body()
    body: {
      name: string;
      price: Number;
      sale_price: Number;
      information: string;
      type: string;
      description: Object;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
    },
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 200000 })
        .build({
          fileIsRequired: false,
        }),
    )
    files?: Array<Express.Multer.File> | [],
  ) {
    return await this.productFactory.createProduct(body.type, { body, files });
  }

  @Patch('/:id')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FilesInterceptor('addedimages', 6))
  async updateProduct(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      price: Number;
      sale_price: Number;
      information: string;
      type: string;
      description: Object;
      category: string;
      linkytb: string;
      extraInfo: Array<string>;
      variants: Array<{ label: string; variants: Array<string> }>;
      left: Number;
      images: Array<string>;
    },
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 50000 })
        .build({
          fileIsRequired: false,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return await this.productFactory.updateProduct(body.type, {
      id,
      body,
      files,
    });
  }
  @Get('/top10newest')
  @HttpCode(200)
  async getTop10NewestProducts() {
    return await this.productFactory.getTop10NewestProducts();
  }

  @Get('/:id')
  @HttpCode(200)
  async getProduct(@Param('id') id: string) {
    return await this.productFactory.getProduct(id);
  }

  @Get('')
  @HttpCode(200)
  async getAllProducts(
    @Query('search') search: string,
    @Query('category') category: string,
    @Query('sort') sort: string,
  ) {
    return await this.productFactory.getAllProducts({
      filter: {
        category,
      },
      search,
      sort,
    });
  }
}
