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
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RequestModel } from 'src/helpers/requestmodel';
import { CommentService } from 'src/services/comment.service';

@Controller('/api/v1/comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  @UseInterceptors(FilesInterceptor('images', 6))
  async createComment(
    @Req() req: RequestModel,
    @Body() body: { product: string; comment: string; rating: number },
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({ maxSize: 100000 })
        .build({
          fileIsRequired: false,
        }),
    )
    files?: Array<Express.Multer.File> | [],
  ) {
    return await this.commentService.createComment(
      { user: req.user.userId, ...body },
      files,
    );
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async deleteComment(@Param('id') id: string) {
    return await this.commentService.deleteComment(id);
  }

  @Get('/')
  @HttpCode(200)
  async getAllComments(
    @Query('product') product: string,
    @Query('rating') rating: string,
    @Query('sort') sort: string,
  ) {
    return await this.commentService.getAllComments(product, { rating }, sort);
  }

  @Patch('/:comment/like')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async likeComment(
    @Param('comment') comment: string,
    @Req() req: RequestModel,
  ) {
    return await this.commentService.likeComment(comment, req.user.userId);
  }

  @Patch('/:comment/unlike')
  @HttpCode(200)
  @UseGuards(AuthenticationGuard)
  async unlikeComment(
    @Param('comment') comment: string,
    @Req() req: RequestModel,
  ) {
    return await this.commentService.unlikeComment(comment, req.user.userId);
  }
}
