import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreController } from 'src/controllers/store.controller';
import { StoreRepo } from 'src/models/repo/store.repo';
import { UserRepo } from 'src/models/repo/user.repo';
import { StoreSchema } from 'src/models/store.model';
import { UserSchema } from 'src/models/user.model';
import { StoreService } from 'src/services/store.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [StoreController],
  providers: [StoreService, StoreRepo, UserRepo],
  exports: [StoreService],
})
export class StoreModule {
  constructor() {}
}
