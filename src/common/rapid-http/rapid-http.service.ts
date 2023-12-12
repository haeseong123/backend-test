import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ErrorMessage } from '../exception/error-message';
import { HttpMethod } from './type/http-method';
import { AxiosResponse } from 'axios';
import { SendRequestDto } from './dto/send-request.dto';

@Injectable()
export class RapidHttpService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * http 요청을 보냅니다.
   */
  sendRequest<T>(dto: SendRequestDto): Promise<AxiosResponse<T, any>> {
    const axiosMethod = this.getAxiosMethod(dto.method);
    const onrejected = dto.onRejected
      ? dto.onRejected
      : this.throwInternalServerException;

    return axiosMethod<T>(dto.uri).catch(onrejected);
  }

  /**
   * http method에 맞는 axios 함수를 반환합니다.
   */
  private getAxiosMethod(method: HttpMethod) {
    switch (method) {
      case 'POST':
        return this.httpService.axiosRef.post;
      case 'GET':
        return this.httpService.axiosRef.get;
      case 'PUT':
        return this.httpService.axiosRef.put;
      case 'DELETE':
        return this.httpService.axiosRef.delete;
      default:
        this.throwInternalServerException();
    }
  }

  /**
   * InternalServerErrorException을 throw합니다.
   */
  private throwInternalServerException(): never {
    throw new InternalServerErrorException(ErrorMessage.INTERNAL_SERVER_ERROR);
  }
}
