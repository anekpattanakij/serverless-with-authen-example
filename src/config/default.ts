import { MysqlConfiguration } from './../common/mysqlConfig';
import { RedisConfiguration} from './../common/redisConfig';

export class DefaultConfig {
    public static SIGN_TOKEN:string = 'AdsSortToken';
    public static SESSION_TIMEOUT_SECOND:number = 600;
    public static host:string  = process.env.NODE_HOST || 'localhost';
    public static port:string = process.env.PORT;
    public static REDIS_HOST:string = '192.168.99.100';
    public static REDIS_PORT:number = 6379;
    public static REDIS_CONFIGURATION:RedisConfiguration = new RedisConfiguration(DefaultConfig.REDIS_HOST,DefaultConfig.REDIS_PORT,DefaultConfig.SESSION_TIMEOUT_SECOND);
    public static MYSQL_HOST:string = '192.168.99.100';
    public static MYSQL_PORT:number = 3306;
    public static MYSQL_USER:string = 'root';
    public static MYSQL_PASSWORD:string = 'Paul1234';
    public static MYSQL_DATABASE:string = 'Fictionio';
    public static MYSQL_CONFIGURATION:MysqlConfiguration = new MysqlConfiguration(DefaultConfig.MYSQL_HOST,DefaultConfig.MYSQL_PORT,DefaultConfig.MYSQL_USER,DefaultConfig.MYSQL_PASSWORD,DefaultConfig.MYSQL_DATABASE);
  }
