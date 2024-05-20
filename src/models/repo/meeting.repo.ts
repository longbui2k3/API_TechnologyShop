import { Model } from 'mongoose';
import { Meeting } from '../meeting.model';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetingRepo {
  constructor(@InjectModel('Meeting') private meetingModel: Model<Meeting>) {}

  async createMeeting(id: string, token: string) {
    return await this.meetingModel.create({ id, token });
  }
}
