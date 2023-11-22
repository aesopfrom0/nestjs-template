import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { BaseService } from './base.service';
import ProcessLock from './shared/utils/process-lock.util';

@Injectable()
export class AppService extends BaseService implements OnModuleDestroy {
  getHello(): string {
    this.logger.log('dasfdsafsfdas', this.getHello.name);
    return 'Hello World!';
  }

  async onModuleDestroy() {
    //실행 중인 프로세스를 모두 종료한 이후에 서버가 종료된다.
    ProcessLock.shutdown();
    while (ProcessLock.getCount() > 0) {
      this.logger.debug(`[!] 실행중인 process 수 : ${ProcessLock.getCount()}`);
      await new Promise((r) => {
        setTimeout(r, 100);
      });
    }
    this.logger.log(`[!] ModuleDestroy 성공`);
  }
}
