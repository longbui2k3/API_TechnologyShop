import { Injectable } from '@nestjs/common';
import { StoreRepo } from 'src/models/repo/store.repo';
import { UserRepo } from 'src/models/repo/user.repo';

@Injectable()
export class StoreService {
  constructor(
    private storeRepo: StoreRepo,
    private userRepo: UserRepo,
  ) {}

  async createStore(
    body: {
      name: string;
      address: string;
      mobile: string;
      introduce: string;
      user: string;
    },
    files: Array<Express.Multer.File>,
  ) {
    const checkUserExists = await this.userRepo.checkUserExists(body.user);

    return {
      message: 'Create store successfully!',
      status: 201,
      metadata: {
        store: await this.storeRepo.createStore(body, files),
      },
    };
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
    const checkStoreExists = await this.storeRepo.checkStoreExists(id);

    return {
      message: 'Update store successfully!',
      status: 200,
      metadata: {
        store: await this.storeRepo.updateStore(id, body, files),
      },
    };
  }

  async getStore(id: string) {
    const checkStoreExists = await this.storeRepo.checkStoreExists(id);
    return {
      message: 'Get store successfully!',
      status: 200,
      metadata: {
        store: await this.storeRepo.getStore(id),
      },
    };
  }
}
