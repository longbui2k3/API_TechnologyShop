import { Injectable } from '@nestjs/common';
import { CategoryRepo } from 'src/models/repo/category.repo';

@Injectable()
export class CategoryService {
  constructor(private categoryRepo: CategoryRepo) {}

  async getAllCategories() {
    return {
      status: 200,
      message: 'Get all categories successfully!',
      metadata: { categories: await this.categoryRepo.getAllCategories() },
    };
  }

  async getCategory(category_id: string) {
    const checkCategoryExists =
      await this.categoryRepo.checkCategoryExists(category_id);
    return {
      status: 200,
      message: 'Get category successfully!',
      metadata: {
        category: await this.categoryRepo.getCategory(category_id),
      },
    };
  }

  async addCategory(
    body: { name: string; typeName: string },
    file: Express.Multer.File,
  ) {
    return {
      status: 201,
      message: 'Add category successfully!',
      metadata: {
        category: await this.categoryRepo.addCategory(body, file),
      },
    };
  }

  async updateCategory(
    body: { name: string },
    file: Express.Multer.File,
    category_id: string,
  ) {
    const checkCategoryExists =
      await this.categoryRepo.checkCategoryExists(category_id);
    return {
      status: 200,
      message: 'Update category successfully!',
      metadata: {
        category: await this.categoryRepo.updateCategory(
          body,
          file,
          category_id,
        ),
      },
    };
  }
  async deleteCategory(category_id: string) {
    const checkCategoryExists =
      await this.categoryRepo.checkCategoryExists(category_id);
    await this.categoryRepo.deleteCategory(category_id);

    return {
      status: 200,
      message: 'Delete category successfully!',
    };
  }
}
