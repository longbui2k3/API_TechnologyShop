import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/controllers/user.controller';
import { UserRepo } from 'src/models/repo/user.repo';
import { User, UserSchema } from 'src/models/user.model';
import { UserService } from 'src/services/user.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService, UserRepo],
  exports: [UserService],
})
export class UserModule {
  constructor() {}
}
