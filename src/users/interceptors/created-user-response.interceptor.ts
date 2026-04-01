import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from 'src/users/user.schema';

@Injectable()
export class CreatedUserResponseInterceptor implements NestInterceptor {
  private static readonly DEFAULT_ID = '';

  intercept(
    _context: ExecutionContext,
    next: CallHandler<User>,
  ): Observable<Record<string, unknown> & { id: string }> {
    return next.handle().pipe(
      map((data: User): Record<string, unknown> & { id: string } => {
        const plainUser =
          typeof data.toJSON === 'function' ? data.toJSON() : data;
        const { _id, ...rest } = plainUser as Record<string, unknown> & {
          _id?: { toString(): string } | string;
        };
        const id = _id
          ? _id.toString()
          : CreatedUserResponseInterceptor.DEFAULT_ID;
        return {
          ...rest,
          id,
        };
      }),
    );
  }
}
