import { BaseCustomClass } from './baseCustomClass';

export class MysqlConfiguration extends BaseCustomClass {
  public host: string;
  public port: number;
  public user: string;
  public password: string;
  public database: string;

  constructor(
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
  ) {
    super();
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.database = database;
  }
}
