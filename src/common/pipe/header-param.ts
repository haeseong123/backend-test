import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { ErrorMessage } from 'src/common/exception/error-message';
import { Request } from 'express';

export const HeaderParam = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const value = key ? request.headers[key] : request.headers;

    if (!value) {
      throw new BadRequestException(ErrorMessage.HEADER_PARAM_IS_MISSING);
    }

    return value;
  },
);
