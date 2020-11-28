import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const LoggedUserWs = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const data = ctx.switchToWs().getData();
    return data.userId;
  },
);
