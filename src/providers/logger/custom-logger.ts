import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  log(message: any, context?: string) {
    const customMessage = `[${this.#functionName()}] ${message}`;
    context ? super.log(customMessage, context) : super.log(customMessage);
  }

  error(message: any, trace?: string, context?: string) {
    const customMessage = `[${this.#functionName()}] ${message}`;
    super.error(customMessage, trace);
  }

  debug(message: any, context?: string) {
    const customMessage = `[${this.#functionName()}] ${message}`;
    super.debug(customMessage);
  }

  #functionName(): string {
    const stackTrace = new Error().stack;
    const caller = stackTrace?.split('\n')[2].trim();
    const functionName = caller?.substring(caller.indexOf('.') + 1, caller.indexOf(' ('));
    return functionName ?? '';
  }
}
