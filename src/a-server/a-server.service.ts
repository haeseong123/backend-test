import { Injectable } from '@nestjs/common';
import { AServerApiPath } from './a-server-api-path';

@Injectable()
export class AServerService {
  constructor() {}

  /**
   * A server의 API 호출
   *
   * @returns A server로부터 받은 응답
   */
  proxy(path: AServerApiPath) {
    // path를 통해 서버 API 호출
    // ...

    console.log('https://rapidup.co.kr' + path);

    return true;
  }
}
