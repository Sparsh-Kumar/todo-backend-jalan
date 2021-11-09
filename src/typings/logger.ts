export interface Logger {
  error(message: string, ...meta: any[]): Logger;
  warn(message: string, ...meta: any[]): Logger;
  info(message: string, ...meta: any[]): Logger;
  debug(message: string, ...meta: any[]): Logger;
}
