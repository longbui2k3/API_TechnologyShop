import { InjectModel } from '@nestjs/mongoose';
import { History } from '../history.model';
import { Model } from 'mongoose';
import { getUnselectData } from 'src/utils';
import { HistoryService } from 'src/services/history.service';

export class HistoryRepo {
  constructor(
    @InjectModel('History')
    private historyModel: Model<History>,
  ) {}
  async addProductToHistory(params: { user_id: string; product_id: string }) {
    return (
      await this.historyModel.findOneAndUpdate(
        { user: params.user_id },
        {
          $addToSet: {
            viewedProducts: {
              product: params.product_id,
              viewedAt: Date.now(),
            },
          },
        },
        { new: true, upsert: true },
      )
    ).viewedProducts;
  }
  async getProductsInHistory(userId: string, unselect: Array<string>) {
    let history = await this.historyModel
      .findOne({
        user: userId,
      })
      .populate({
        path: 'viewedProducts.product',
        select: getUnselectData(unselect),
      });
    if (!history) {
      history = await this.historyModel.create({ user: userId });
    }
    return history.viewedProducts;
  }

  async addSearchedWordToHistory(userId: string, word: string) {
    return (
      await this.historyModel.findOneAndUpdate(
        { user: userId },
        {
          $addToSet: {
            searchedWords: word,
          },
        },
        { new: true, upsert: true },
      )
    ).searchedWords;
  }

  async getSearchedWordsInHistory(userId: string, unselect: Array<string>) {
    let history = await this.historyModel.findOne({
      user: userId,
    });
    if (!history) {
      history = await this.historyModel.create({ user: userId });
    }
    return history.searchedWords;
  }
}
