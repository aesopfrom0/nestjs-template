import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { ErrorCode } from '../exceptions/error-code';

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
    const trackingEventId = randomUUID();
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

    if (exception instanceof ForbiddenException) {
      response.status(status).json({
        message: exception.toString(),
        errorCode: ErrorCode.AUTH_NOT_FOUND,
        timestamp: Date.now(),
        trackingEventId,
      });
    }
    logger.error(`${method} ${path} ${originIp} ${JSON.stringify(body)}\nError : ${message}`);
  }
}
