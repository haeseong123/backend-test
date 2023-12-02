import { Injectable } from '@nestjs/common';
import { AServerApiPath } from './a-server-api-path';

@Injectable()
export class AServerService {
  constructor() {}

  /**
   * A server의 API 호출
   *
   * Client의 IP를 기준으로 초당 최대 10회 제약 조건이 있습니다.
   * 만약 클라이언트로부터 초당 10회를 초과하여 요청이 온다면 적절한 Error message를 보냅니다.
   *
   * @returns A 서버로부터 받은 응답
   */
  proxy(path: AServerApiPath) {
    // 제약 조건 확인
    // ...

    // path를 통해 서버 API 호출
    // ...

    console.log('https://rapidup.co.kr' + path);

    return true;
  }
}
