import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorators';
import { Roles } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // ✅ Skip guard if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles = this.reflector.get<string[]>(Roles, context.getHandler());
    if (!roles || roles.length === 0) return true; // no role restriction

    const request = context.switchToHttp().getRequest();
    const user = request.user; // should already be set by JwtAuthGuard

    if (!user) {
      throw new ForbiddenException('User not found on request (JWT missing or invalid)');
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('Access denied for your role');
    }

    return true;
  }
}
