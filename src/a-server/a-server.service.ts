import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AServerApiPath } from './a-server-api-path';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { ErrorMessage } from 'src/common/exception/error-message';

@Injectable()
export class AServerService {
  constructor(private readonly httpService: HttpService) {}

  async post<T>(path: AServerApiPath): Promise<boolean> {
    const observableRequest = this.httpService.post<T>(this.getUri(path));

    return await this.handleRequest(observableRequest);
  }

  async get<T>(path: AServerApiPath): Promise<boolean> {
    const observableRequest = this.httpService.get<T>(this.getUri(path));

    return await this.handleRequest(observableRequest);
  }

  async put<T>(path: AServerApiPath): Promise<boolean> {
    const observableRequest = this.httpService.put<T>(this.getUri(path));

    return await this.handleRequest(observableRequest);
  }

  async delete<T>(path: AServerApiPath): Promise<boolean> {
    const observableRequest = this.httpService.delete<T>(this.getUri(path));

    return await this.handleRequest(observableRequest);
  }

  /**
   * A server의 API 호출
   *
   * @returns boolean (실사용 시 T)
   */
  private async handleRequest<T>(
    observableRequest: Observable<AxiosResponse<T, any>>,
  ): Promise<boolean> /**  실사용 시 Promise<boolean>을 Promise<T>로 바꾸어야 함 */ {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data } = await firstValueFrom(
      observableRequest.pipe(
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException(
            error.response?.data,
            ErrorMessage.REQUEST_TO_ANOTHER_SERVER_FAILS,
          );
        }),
      ),
    );

    /**
     * 실사용 시 data를 return해야 함
     */
    return true;
  }

  private getUri(path: AServerApiPath): string {
    return 'https://rapidup.co.kr' + path;
  }
}
