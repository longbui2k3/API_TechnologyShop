import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/authUtils/authentication.guard';
import { RolesGuard } from 'src/auth/authUtils/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RequestModel } from 'src/helpers/requestmodel';
import { HistoryService } from 'src/services/history.service';

@Controller('/api/v1/history')
export class HistoryController {
  constructor(private HistoryService: HistoryService) {}

  @Patch('/viewedproducts')
  @HttpCode(200)
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async addProductToHistory(
    @Req() req: RequestModel,
    @Body() body: { product: string },
  ) {
    return await this.HistoryService.addProductToHistory({
      user_id: req.user.userId,
      product_id: body.product,
    });
  }

  @Get('/viewedproducts')
  @HttpCode(200)
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getProductsInHistory(@Req() req: RequestModel) {
    return await this.HistoryService.getProductsInHistory(req.user.userId);
  }

  @Patch('/searchedwords')
  @HttpCode(200)
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async addSearchedWordToHistory(
    @Req() req: RequestModel,
    @Body() body: { word: string },
  ) {
    return await this.HistoryService.addSearchedWordToHistory(
      req.user.userId,
      body.word,
    );
  }

  @Get('/searchedwords')
  @HttpCode(200)
  @Roles(Role.User, Role.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  async getSearchedWordsInHistory(@Req() req: RequestModel) {
    return await this.HistoryService.getSearchedWordsInHistory(req.user.userId);
  }
}
