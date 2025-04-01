import { Injectable } from '@nestjs/common';
import { OnApplicationShutdown } from '@nestjs/common';
import { BaseService } from '@/base.service';

@Injectable()
export class ShutdownService extends BaseService implements OnApplicationShutdown {
  private isShuttingDown = false;
  private activeRequests = 0;

  async onApplicationShutdown(signal: string) {
    this.logger.log(`Received shutdown signal: ${signal}`);
    this.isShuttingDown = true;

    while (this.activeRequests > 0) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    await this.gracefulShutdown();
  }

  private async gracefulShutdown() {
    this.logger.log('Graceful shutdown process started...');

    this.logger.log('Graceful shutdown process completed.');
    process.exit(0); // 프로세스를 종료
  }

  trackRequestStart() {
    this.activeRequests++;
  }

  trackRequestEnd() {
    this.activeRequests--;
  }
}
