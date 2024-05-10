import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../comment.model';
import { UploadFiles } from 'src/utils/uploadFiles';
import { BadRequestException } from '@nestjs/common';
import { getUnselectData, removeUndefinedInObject } from 'src/utils';

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
    return await this.commentModel.create({ ...body, images });
  }

  async deleteComment(id: string) {
    await this.commentModel.findByIdAndDelete(id);
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
    return await this.commentModel
      .find(removeUndefinedInObject({ product, ...filter }))
      .populate({ path: 'user', select: { name: 1, avatar: 1 } })
      .sort(sortBy)
      .select(getUnselectData(unselect))
      .lean();
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
