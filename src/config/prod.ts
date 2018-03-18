import { DefaultConfig } from './default';

export class ProductionConfig extends DefaultConfig {
  // TODO Over write default settings here...
  public static REDIS_HOST: string = '192.168.99.100';
  public static REDIS_PORT: number = 6379;
  public static MYSQL_HOST: string = '192.168.99.100';
  public static MYSQL_PORT: number = 3306;
  public static MYSQL_USER: string = 'root';
  public static MYSQL_PASSWORD: string = 'Paul1234';
  public static MYSQL_DATABASE: string = 'Fictionio';
}
