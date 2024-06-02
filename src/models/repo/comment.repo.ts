import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../comment.model';
import { UploadFiles } from 'src/utils/uploadFiles';
import { BadRequestException } from '@nestjs/common';
import { getUnselectData, removeUndefinedInObject } from 'src/utils';
import { compact } from 'lodash';

export class CommentRepo {
  constructor(@InjectModel('Comment') private commentModel: Model<Comment>) {}
  async checkCommentExists(comment_id: string) {
    const comment = await this.commentModel.findById(comment_id);
    if (!comment) {
      throw new BadRequestException(
        `Comment with id ${comment_id} is not found!`,
      );
    }
    return comment;
  }
  async createComment(
    body: {
      user: string;
      product: string;
      comment: string;
      rating: number;
      parentComment: string;
    },
    files: Array<Express.Multer.File> | [],
  ) {
    const images = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const image = await new UploadFiles(
          'comments',
          'image',
          file,
        ).uploadFileAndDownloadURL();
        return image;
      }),
    );

    const parentComment = await this.commentModel.findById(body.parentComment);

    let left: number;
    if (parentComment) {
      left = parentComment.right;
      await this.commentModel.updateMany(
        {
          product: body.product,
          left: {
            $gte: left,
          },
        },
        {
          $inc: {
            left: 2,
          },
        },
      );
      await this.commentModel.updateMany(
        {
          product: body.product,
          right: {
            $gte: left,
          },
        },
        {
          $inc: {
            right: 2,
          },
        },
      );
    } else {
      const maxRightValue = await this.commentModel.findOne(
        { product: body.product },
        'right',
        { sort: { right: -1 } },
      );
      if (maxRightValue) {
        left = maxRightValue.right + 1;
      } else {
        left = 1;
      }
    }

    let right = left + 1;
    return await this.commentModel.create({
      ...body,
      images,
      parentComment: parentComment?._id,
      left,
      right,
    });
  }

  async deleteComment(body: { id: string; user: string }) {
    const comment = await this.commentModel.findOne({
      _id: body.id,
      user: body.user,
    });

    await this.commentModel.deleteMany({
      product: comment.product,
      left: { $gte: comment.left },
      right: { $lte: comment.right },
    });

    let sub: number = comment.right - comment.left + 1;
    await this.commentModel.updateMany(
      {
        product: comment.product,
        left: { $gte: comment.right },
      },
      {
        $inc: {
          left: -sub,
        },
      },
    );

    await this.commentModel.updateMany(
      {
        product: comment.product,
        right: { $gte: comment.right },
      },
      {
        $inc: {
          right: -sub,
        },
      },
    );
  }

  async getAllComments(
    product: string,
    filter: {},
    unselect: Array<string>,
    sort: string = 'ctime',
  ) {
    const sortBy: Record<string, 1 | -1> = Object.fromEntries(
      [sort].map((item) => [item, -1]),
    );

    let comments: any = await this.commentModel
      .find(removeUndefinedInObject({ product, ...filter, parentComment: null }))
      .populate({ path: 'user', select: { name: 1, avatar: 1 } })
      .sort(sortBy)
      .select(getUnselectData(unselect))
      .lean();
    comments = await Promise.all(
      comments.map(async (comment: any) => {
        comment.repComments = await this.commentModel.find({
          parentComment: comment._id,
        });
        return comment;
      }),
    );
    return comments;
  }
  async likeComment(id: string, userId: string) {
    const comment = await this.commentModel.findOne({
      _id: id,
      usersLiked: userId,
    });
    if (comment) {
      throw new BadRequestException(`User has already liked comment!`);
    }
    return await this.commentModel.findByIdAndUpdate(
      id,
      {
        $inc: { numberOfLikes: 1 },
        $addToSet: {
          usersLiked: userId,
        },
      },
      { new: true },
    );
  }

  async unlikeComment(id: string, userId: string) {
    const comment = await this.commentModel.findOne({
      _id: id,
      usersLiked: userId,
    });
    if (!comment) {
      throw new BadRequestException(`User hasn't liked comment!`);
    }
    return await this.commentModel.findByIdAndUpdate(
      id,
      {
        $inc: { numberOfLikes: -1 },
        $pull: {
          usersLiked: userId,
        },
      },
      { new: true },
    );
  }
}
