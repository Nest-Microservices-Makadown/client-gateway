/* More info here: https://docs.nestjs.com/decorators */

import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

/**
 * Custom decorator to get the user from the request. 
 * :D teehee!
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {

    const request = ctx.switchToHttp().getRequest();

    if(!request.user) {
      throw new InternalServerErrorException('User not found in request (AuthGuard called?)');
    }

    return request.user;
  },
);