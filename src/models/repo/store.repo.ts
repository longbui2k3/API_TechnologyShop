import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store } from '../store.model';
import { BadRequestException } from '@nestjs/common';
import { UploadFiles } from 'src/utils/uploadFiles';
import { removeUndefinedInObject } from 'src/utils';

export class StoreRepo {
  constructor(@InjectModel('Store') private storeModel: Model<Store>) {}
  async checkStoreExists(store_id: string) {
    const store = await this.storeModel.findById(store_id);
    if (!store) {
      throw new BadRequestException(`Store with id ${store_id} is not found!`);
    }
    return store;
  }
  async createStore(
    body: {
      name: string;
      address: string;
      mobile: string;
      introduce: string;
      user: string;
    },
    files: Array<Express.Multer.File> | [] = [],
  ) {
    const images = await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const image = await new UploadFiles(
          'stores',
          'image',
          file,
        ).uploadFileAndDownloadURL();
        return image;
      }),
    );
    return await this.storeModel.create({ ...body, images });
  }

  async updateStore(
    id: string,
    body: {
      name: string;
      address: string;
      mobile: string;
      introduce: string;
      images: Array<string>;
    },
    files?: Array<Express.Multer.File> | [],
  ) {
    let updateImages = undefined;
    if (files) {
      updateImages = await Promise.all(
        files.map(async (file: Express.Multer.File) => {
          const image = await new UploadFiles(
            'products',
            'image',
            file,
          ).uploadFileAndDownloadURL();
          return image;
        }),
      );
    }
    return await this.storeModel.findByIdAndUpdate(
      id,
      removeUndefinedInObject({
        ...body,
        images: [...updateImages, ...body.images],
      }),
      { new: true },
    );
  }

  async getStore(id: string) {
    return await this.storeModel.findById(id);
  }
}
