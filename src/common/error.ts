import { BaseCustomClass } from './baseCustomClass';

export const ERROR_CODE_INVALID_INPUT:string = 'ERR_INPUT';
export const ERROR_CODE_INVALID_TOKEN:string = 'ERR_INVALID_TOKEN';
export const ERROR_CODE_NO_AUTHORIZE:string = 'ERR_NO_AUTHORIZE';
export const ERROR_CODE_REDIS_CONNECTION:string = 'ERR_REDIS_CONNECTION';
export const ERROR_CODE_MYSQL_CONNECTION:string = 'ERR_MYSQL_CONNECTION';
// User error list
export const ERROR_CODE_USER_DUPLICATE_EMAIL:string = 'ERR_USER_DUPLICATE_EMAIL';

export class Error extends BaseCustomClass {
  public code: string;
  public message: string;

  constructor(code: string, message: string) {
    super();
    this.code = code;
    this.message = message;
  }
}
