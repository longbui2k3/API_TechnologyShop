import { Injectable } from '@nestjs/common';
import { CommentRepo } from 'src/models/repo/comment.repo';
import { ProductRepo } from 'src/models/repo/product.repo';

@Injectable()
export class CommentService {
  constructor(
    private commentRepo: CommentRepo,
    private productRepo: ProductRepo,
  ) {}

  async createComment(
    body: { user: string; product: string; comment: string; rating: number },
    files: Array<Express.Multer.File> | [],
  ) {
    const checkProductExists = await this.productRepo.checkProductExists(
      body.product,
    );

    return {
      message: 'Create comment successfully!',
      status: 201,
      metadata: {
        comment: await this.commentRepo.createComment(body, files),
      },
    };
  }

  async deleteComment(id: string) {
    const checkCommentExists = await this.commentRepo.checkCommentExists(id);
    await this.commentRepo.deleteComment(id);
    return {
      message: 'Delete comment successfully!',
      status: 200,
    };
  }

  async getAllComments(product: string, filter: {}, sort: string) {
    const checkProductExists =
      await this.productRepo.checkProductExists(product);

    return {
      message: 'Get all comments successfully!',
      status: 200,
      metadata: {
        products: await this.commentRepo.getAllComments(product, filter, ['__v', 'updatedAt'], sort),
      },
    };
  }

  async likeComment(id: string, userId: string) {
    const checkCommentExists = await this.commentRepo.checkCommentExists(id);

    return {
      message: 'Like comment successfully!',
      status: 200,
      metadata: {
        comment: await this.commentRepo.likeComment(id, userId),
      },
    };
  }
  async unlikeComment(id: string, userId: string) {
    const checkCommentExists = await this.commentRepo.checkCommentExists(id);

    return {
      message: 'Unlike comment successfully!',
      status: 200,
      metadata: {
        comment: await this.commentRepo.unlikeComment(id, userId),
      },
    };
  }
}
