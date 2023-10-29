import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';

@Injectable()
export class AppService extends BaseService {
  getHello(): string {
    this.logger.log('dasfdsafsfdas', this.getHello.name)
    return 'Hello World!';
  }
}
