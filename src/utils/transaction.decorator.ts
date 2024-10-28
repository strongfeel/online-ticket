import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const QueryRunnerParam = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.queryRunner;
  },
);

export const TRANSACTION_ISOLATION_LEVEL = 'TRANSACTION_ISOLATION_LEVEL';

export const Transaction = (isolationLevel: string) =>
  SetMetadata(TRANSACTION_ISOLATION_LEVEL, isolationLevel);
