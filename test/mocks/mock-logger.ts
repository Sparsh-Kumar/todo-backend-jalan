import { Logger } from '@typings';

export class MockLogger implements Logger {
  error(message: string, ...meta: any[]): Logger {
    return this;
  }
  warn(message: string, ...meta: any[]): Logger {
    return this;
  }
  info(message: string, ...meta: any[]): Logger {
    return this;
  }
  debug(message: string, ...meta: any[]): Logger {
    return this;
  }
}
