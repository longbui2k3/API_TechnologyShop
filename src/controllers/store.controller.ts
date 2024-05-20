import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RolesGuard } from 'src/auth/authUtils/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RequestModel } from 'src/helpers/requestmodel';
import { StoreService } from 'src/services/store.service';

@Controller('/api/v1/store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post()
  @HttpCode(201)
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('images', 6))
  async createStore(
    @Body()
    body: { name: string; address: string; mobile: string; introduce: string },
    @Req() req: RequestModel,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 5000000 })
        .build({
          fileIsRequired: false,
        }),
    )
    files?: Array<Express.Multer.File> | [],
  ) {
    return this.storeService.createStore(
      { ...body, user: req.user.userId },
      files,
    );
  }

  @Patch('/:id')
  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  @UseInterceptors(FilesInterceptor('addedimages', 6))
  async updateStore(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      address: string;
      mobile: string;
      introduce: string;
      images: Array<string>;
    },
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 5000000 })
        .build({
          fileIsRequired: false,
        }),
    )
    files?: Array<Express.Multer.File> | [],
  ) {
    return await this.storeService.updateStore(id, body, files);
  }

  @Get('/:id')
  @HttpCode(200)
  async getStore(@Param('id') id: string) {
    return await this.storeService.getStore(id);
  }
}
