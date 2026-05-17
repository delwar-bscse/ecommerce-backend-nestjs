import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  mixin,
} from '@nestjs/common';

export function RoleGuard(...roles: string[]): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();

      const user = request.currentUser;

      return user.roles.some((role: string) =>
        roles.includes(role),
      );
    }
  }

  return mixin(RoleGuardMixin);
}