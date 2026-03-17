import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // should already be set by JwtAuthGuard

    if (!user) {
      throw new ForbiddenException('USER_NOT_AUTHENTICATED');
    }

    const userRole = String(user.role ?? '').toUpperCase();
    const allowedRoles = roles.map((r) => String(r).toUpperCase());
    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenException('ROLE_FORBIDDEN');
    }

    return true;
  }
}
