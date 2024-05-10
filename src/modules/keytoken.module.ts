import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KeyTokenSchema } from 'src/models/keytoken.model';
import { KeyTokenService } from 'src/services/keytoken.service';


@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'KeyToken', schema: KeyTokenSchema }])],
  providers: [KeyTokenService],
  exports: [KeyTokenService],
})
export class KeyTokenModule {
  constructor(private keyTokenService: KeyTokenService) {}
}
