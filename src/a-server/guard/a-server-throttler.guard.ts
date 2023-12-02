import { ThrottlerGuard } from '@nestjs/throttler';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessage } from 'src/common/exception/error-message';

@Injectable()
export class AServerThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    /**
     * 클라이언트의 Request header에는 유저 아이디가 포함되어 있습니다.
     *
     * Header: { id: ‘0000-0000-0000-0000’ }
     *
     * 해당 id를 기준으로 rate limit을 수행합니다.
     */
    const id = req.headers.id;

    if (!id) {
      throw new BadRequestException(ErrorMessage.CUSTOM_ID_HEADER_IS_MISSING);
    }

    return id;
  }
}
