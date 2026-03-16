import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext): ActiveUserData | ActiveUserData[keyof ActiveUserData] | undefined => {
    const request = ctx.switchToHttp().getRequest<{ [REQUEST_USER_KEY]?: ActiveUserData }>();
    const user = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);