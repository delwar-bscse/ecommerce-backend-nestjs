import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';

export function RoleGuard(...roles: string[]): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();

      const user = request.currentUser;

      if (!user) {
        throw new UnauthorizedException('You do not have permission to access this resource');
      }

      return user.roles.some((role: string) =>
        roles.includes(role),
      );
    }
  }

  return mixin(RoleGuardMixin);
}