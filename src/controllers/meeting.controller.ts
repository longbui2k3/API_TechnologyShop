import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RolesGuard } from 'src/auth/authUtils/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { MeetingService } from 'src/services/meeting.service';

@Controller('/api/v1/meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Post('/')
  @HttpCode(201)
  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async createMeeting(@Body() body: { id: string; token: string }) {
    return await this.meetingService.createMeeting(body.id, body.token);
  }
}
