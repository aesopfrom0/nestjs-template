import { BadRequestException } from '@nestjs/common';
import ApplicationException from '../exceptions/application.exception';
import { ErrorCode } from '../exceptions/error-code';

export default class ProcessLock {
  private static processRequest = new Map();
  public static isShutdown = false;

  //락을 획득한다. 이미 락이 되어있다면 false를 리턴
  static acquire(key, errCode?: ErrorCode) {
    if (this.isShutdown) {
      //종료 예정인 경우
      throw new ApplicationException(
        new BadRequestException(`일시적인 오류입니다. 잠시 후 다시 실행 해주세요.`),
        ErrorCode.SYSTEM_ERROR,
      );
    }
    const isLocked = this.processRequest.has(key) && this.processRequest.get(key);
    if (isLocked) {
      //프로세스가 실행중이면 지정된 error를 리턴한다.
      throw new ApplicationException(
        new BadRequestException(`프로세스가 실행 중 입니다 : ${key}`),
        errCode || ErrorCode.PROCESSING_REQUEST,
      );
    }

    this.processRequest.set(key, true);
    return true;
  }

  //락을 해제한다.
  static release(key) {
    this.processRequest.delete(key);
  }

  static shutdown() {
    this.isShutdown = true;
  }
  static getCount() {
    return this.processRequest.size;
  }
}
