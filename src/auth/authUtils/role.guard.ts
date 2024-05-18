import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HEADER } from 'src/configs/HEADER';
import JWT from 'jsonwebtoken';
import { KeyTokenService } from 'src/services/keytoken.service';
import { Role } from '../../enums/role.enum';

const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly keyTokenService: KeyTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
      throw new UnauthorizedException('Invalid Request!');
    }
    const keyStore = await this.keyTokenService.findByUserId(userId);
    if (!keyStore) {
      throw new NotFoundException('Not Found KeyStore!');
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
      throw new UnauthorizedException('Invalid Request!');
    }
    try {
      if (typeof accessToken === 'string') {
        const decodeUser: any = JWT.verify(accessToken, keyStore.publicKey);
        return requiredRoles.some((role) => decodeUser.role === role);
      }
    } catch (error) {
      throw error;
    }
    return true;
  }
}
