import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ErrorCode } from '../exceptions/error-code';
import ApplicationException from '@/shared/exceptions/application.exception';

@Catch()
export class AllExceptionsFilter<T> extends BaseExceptionFilter implements ExceptionFilter {
  public catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const { ip, method, body, path } = request;
    const originIp = ip;
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const logger = new Logger(AllExceptionsFilter.name);

    let errorCode = ErrorCode.UNKNOWN_ERROR;
    let message = exception instanceof HttpException ? exception.message : exception.toString();

    if (exception instanceof BadRequestException) {
      const response = (exception as any).getResponse();
      message = response['message'] || message;
      Array.isArray(response.message) && (message = response.message[0]);
      errorCode = ErrorCode.BAD_REQUEST_ERROR;
    } else if (exception instanceof ApplicationException) {
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
      logger.error(`${method} ${path} ${originIp} ${JSON.stringify(body)}\nError : ${message}`);
      return;
    }

    if (exception['response'] && exception['response']['data']) {
      if (exception['response']['data']['error_code']) {
        errorCode = exception['response']['data']['error_code'];
      }
      if (exception['response']['data']['error_msg']) {
        message = exception['response']['data']['error_msg'];
      }
    }

    response.status(status).json({
      error: {
        message,
        errorCode,
        timestamp: Date.now(),
        trackingEventId: request.headers['request-id'],
      },
      meta: {
        responseCode: errorCode,
        message,
        timestamp: Date.now(),
      },
    });

    logger.error(`${method} ${path} ${originIp} ${JSON.stringify(body)}\nError : ${message}`);
  }
}
