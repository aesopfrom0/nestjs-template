import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ErrorCode } from '../exceptions/error-code';
import ApplicationException from '@project-name/shared/exceptions/application.exception';

@Catch()
export class AllExceptionsFilter<T> extends BaseExceptionFilter implements ExceptionFilter {
  public catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const { ip, method, body, path } = request;
    //X-forwarded-for에 ip를 기입하면 요청 ip를 변조할 수 있음, 클라우드플레어에서 제공하는 헤더를 사용해서 판별함
    const originIp = request.headers['cf-connecting-ip'] ?? ip;
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const logger = new Logger(AllExceptionsFilter.name);

    let errorCode = ErrorCode.UNKNOWN_ERROR;
    let message = exception instanceof HttpException ? exception.message : exception.toString();

    if (exception['response'] && exception['response']['data']) {
      if (exception['response']['data']['error_code']) {
        errorCode = exception['response']['data']['error_code'];
      }
      if (exception['response']['data']['error_msg']) {
        message = exception['response']['data']['error_msg'];
      }
    }

    if (exception instanceof ApplicationException) {
      const applicationError: { httpError: HttpException; errorCode: number } = JSON.parse(
        exception['message'],
      );

      response.status(status).json({
        error: {
          message: applicationError.httpError.message,
          errorCode: applicationError.errorCode,
          timestamp: Date.now(),
          trackingEventId: request.headers['request-id'],
        },
        meta: {
          responseCode: applicationError.errorCode,
          message: applicationError.httpError.message,
          timestamp: Date.now(),
        },
      });
    }

    logger.error(`${method} ${path} ${originIp} ${JSON.stringify(body)}\nError : ${message}`);
  }
}
