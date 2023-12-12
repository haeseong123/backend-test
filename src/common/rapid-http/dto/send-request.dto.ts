import { HttpMethod } from '../type/http-method';

export class SendRequestDto {
  uri: string;
  method: HttpMethod;
  onRejected?: () => never;

  constructor(uri: string, method: HttpMethod, onRejected?: () => never) {
    this.uri = uri;
    this.method = method;
    this.onRejected = onRejected;
  }
}
