import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingController } from 'src/controllers/meeting.controller';
import { MeetingSchema } from 'src/models/meeting.model';
import { MeetingRepo } from 'src/models/repo/meeting.repo';
import { MeetingService } from 'src/services/meeting.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Meeting', schema: MeetingSchema }]),
  ],
  controllers: [MeetingController],
  providers: [MeetingService, MeetingRepo],
  exports: [MeetingService],
})
export class MeetingModule {
  constructor() {}
}
