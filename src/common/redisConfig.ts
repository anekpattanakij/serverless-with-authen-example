import { BaseCustomClass } from './baseCustomClass';

export class RedisConfiguration extends BaseCustomClass {
  public host: string;
  public port: number;
  public keyExpireInSecond: number;

  constructor(host: string, port: number, keyExpireInSecond:number) {
    super();
    this.host = host;
    this.port = port;
    this.keyExpireInSecond = keyExpireInSecond;
  }
}
