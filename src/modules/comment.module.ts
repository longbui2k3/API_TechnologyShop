import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from 'src/controllers/comment.controller';
import { CommentSchema } from 'src/models/Comment.model';
import { ProductSchema } from 'src/models/product.model';
import { CommentRepo } from 'src/models/repo/comment.repo';
import { ProductRepo } from 'src/models/repo/product.repo';
import { CommentService } from 'src/services/comment.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepo, ProductRepo],
  exports: [CommentService],
})
export class CommentModule {
  constructor() {}
}
