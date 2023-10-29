import { CustomLogger } from './providers/logger/custom-logger';

export class BaseService {
  protected readonly logger = new CustomLogger(this.constructor.name);
}
