import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category.model';
import { BadRequestException } from '@nestjs/common';
import { UploadFiles } from 'src/utils/uploadFiles';

export class CategoryRepo {
  constructor(
    @InjectModel('Category') private categoryModel: Model<Category>,
  ) {}

  async checkCategoryExists(category_id: string) {
    const category = await this.categoryModel.findById(category_id);
    if (!category) {
      throw new BadRequestException(
        `Category with is ${category_id} is not found!`,
      );
    }
    return category;
  }

  async getAllCategories() {
    return await this.categoryModel.find();
  }

  async getCategory(category_id: string) {
    return await this.categoryModel.findById(category_id);
  }
  async addCategory(
    body: { name: string; typeName: string },
    file: Express.Multer.File,
  ) {
    const image = await new UploadFiles(
      'categories',
      'image',
      file,
    ).uploadFileAndDownloadURL();
    return await this.categoryModel.create({
      name: body.name,
      typeName: body.typeName,
      image,
    });
  }

  async updateCategory(
    body: { name: string },
    file: Express.Multer.File,
    category_id: string,
  ) {
    const image = await new UploadFiles(
      'categories',
      'image',
      file,
    ).uploadFileAndDownloadURL();
    return await this.categoryModel.findByIdAndUpdate(
      category_id,
      {
        name: body.name,
        image,
      },
      {
        new: true,
      },
    );
  }
  async deleteCategory(category_id: string) {
    await this.categoryModel.findByIdAndDelete(category_id);
  }
}
