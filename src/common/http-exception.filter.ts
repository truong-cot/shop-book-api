import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponseData } from './response.helper';
import { RESPONSE_CODE } from 'src/configs/enum';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      message = res.message || res.error || 'Validation failed';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res?.message || exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json(
      BaseResponseData({
        code: RESPONSE_CODE.ERROR,
        message: Array.isArray(message) ? message.join(', ') : message,
        data: null,
      }),
    );
  }
}
