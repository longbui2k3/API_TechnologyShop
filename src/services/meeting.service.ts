import { Injectable } from '@nestjs/common';
import { MeetingRepo } from 'src/models/repo/meeting.repo';

@Injectable()
export class MeetingService {
  constructor(private meetingRepo: MeetingRepo) {}

  async createMeeting(id: string, token: string) {
    return {
      message: 'Create meeting successfully!',
      status: 201,
      metadata: {
        meeting: await this.meetingRepo.createMeeting(id, token),
      },
    };
  }
}
