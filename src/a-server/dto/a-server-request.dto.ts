import { AServerApiPath } from '../enum/a-server-api-path';

export class AServerRequestDto {
  path: AServerApiPath;
  id: string;

  constructor(path: AServerApiPath, id: string) {
    this.path = path;
    this.id = id;
  }
}
