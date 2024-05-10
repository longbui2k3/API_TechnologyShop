import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { HEADER } from 'src/configs/HEADER';
import { KeyTokenService } from 'src/services/keytoken.service';
import JWT from 'jsonwebtoken';
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly keyTokenService: KeyTokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
      throw new UnauthorizedException('Invalid Request!');
    }
    const keyStore = await this.keyTokenService.findByUserId(userId);
    if (!keyStore) {
      throw new NotFoundException('Not Found KeyStore!');
    }

    if (req.headers[HEADER.REFRESHTOKEN]) {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      if (!refreshToken) {
        throw new UnauthorizedException('Invalid Request!');
      }
      try {
        if (typeof refreshToken === 'string') {
          const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
          if (!(typeof decodeUser === 'string'))
            if (userId !== decodeUser.userId) {
              throw new UnauthorizedException('Invalid UserId');
            }
          req.keyStore = keyStore;
          req.user = decodeUser;
          req.refreshToken = refreshToken;
        }
        return true;
      } catch (error) {
        throw error;
      }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
      throw new UnauthorizedException('Invalid Request!');
    }

    try {
      if (typeof accessToken === 'string') {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (!(typeof decodeUser === 'string'))
          if (userId !== decodeUser.userId) {
            throw new UnauthorizedException('Invalid UserId');
          }
        req.keyStore = keyStore;
        req.user = decodeUser;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
