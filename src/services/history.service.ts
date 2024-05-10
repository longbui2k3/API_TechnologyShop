import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepo } from 'src/models/repo/product.repo';
import { HistoryRepo } from 'src/models/repo/history.repo';
import { UserRepo } from 'src/models/repo/user.repo';

@Injectable()
export class HistoryService {
  constructor(
    private historyRepo: HistoryRepo,
    private productRepo: ProductRepo,
    private userRepo: UserRepo,
  ) {}

  async addProductToHistory(params: { user_id: string; product_id: string }) {
    const checkProductExists = await this.productRepo.checkProductExists(
      params.product_id,
    );
    const checkUserExists = await this.userRepo.checkUserExists(params.user_id);

    return {
      message: 'Add product to history successfully!',
      status: 200,
      metadata: {
        history: await this.historyRepo.addProductToHistory(params),
      },
    };
  }

  async getProductsInHistory(userId: string) {
    const checkUserExists = await this.userRepo.checkUserExists(userId);

    return {
      message: 'Get products in history successfully!',
      status: 200,
      metadata: {
        viewedProducts: await this.historyRepo.getProductsInHistory(userId, [
          'linkytb',
          'createdAt',
          'updatedAt',
          '__v',
          'views',
          'sold',
        ]),
      },
    };
  }
  async addSearchedWordToHistory(userId: string, word: string) {
    const checkUserExists = await this.userRepo.checkUserExists(userId);

    return {
      message: 'Add searched word to history successfully!',
      status: 200,
      metadata: {
        searchWords: await this.historyRepo.addSearchedWordToHistory(
          userId,
          word,
        ),
      },
    };
  }

  async getSearchedWordsInHistory(userId: string) {
    const checkUserExists = await this.userRepo.checkUserExists(userId);

    return {
      message: 'Get searched words in history successfully!',
      status: 200,
      metadata: {
        searchWords: await this.historyRepo.getSearchedWordsInHistory(
          userId,
          [],
        ),
      },
    };
  }
}
