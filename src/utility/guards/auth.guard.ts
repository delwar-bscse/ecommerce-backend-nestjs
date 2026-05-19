
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflectMetadata: Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const allowedRoles = this.reflectMetadata.get<string[]>('allowedRoles', context.getHandler());
    if (!allowedRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const result = request.currentUser?.roles.some((role: string) => allowedRoles.includes(role));
    if(!result){
      throw new UnauthorizedException('You do not have permission to access this resource');
    }
    return result
  }
} 