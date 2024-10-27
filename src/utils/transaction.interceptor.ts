import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { TRANSACTION_ISOLATION_LEVEL } from './transaction.decorator';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    private readonly dataSource: DataSource,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const isolationLevel =
      this.reflector.get<string>(
        TRANSACTION_ISOLATION_LEVEL,
        context.getHandler(),
      ) || 'READ COMMITTED';

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(isolationLevel as any);

    const request = context.switchToHttp().getRequest();
    request.queryRunner = queryRunner;

    return next.handle().pipe(
      tap(async () => {
        await queryRunner.commitTransaction();
      }),
      catchError(async (error) => {
        await queryRunner.rollbackTransaction();
        throw error;
      }),
      tap(async () => {
        await queryRunner.release();
      }),
    );
  }
}
