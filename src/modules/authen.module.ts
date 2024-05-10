import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenController } from 'src/controllers/authen.controller';
import { UserSchema } from 'src/models/user.model';
import { AuthenService } from 'src/services/authen.service';

@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [AuthenController],
  providers: [AuthenService],
  exports: [AuthenService],
})
export class AuthenModule {
  constructor(private authenService: AuthenService) {}
}
