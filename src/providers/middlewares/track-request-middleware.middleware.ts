import { Injectable, NestMiddleware } from '@nestjs/common';
import { ShutdownService } from '../shutdown/shutdown.service';
import { NextFunction } from 'express';

@Injectable()
export default class TrackRequestMiddleware implements NestMiddleware {
  constructor(private readonly shutdownService: ShutdownService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // 요청이 시작됨을 추적
    this.shutdownService.trackRequestStart();

    // 요청 처리
    next();

    // 요청이 종료됨을 추적
    this.shutdownService.trackRequestEnd();
  }
}
