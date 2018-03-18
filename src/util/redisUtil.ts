import * as redis from 'thunk-redis';
import { Error } from './../common/error';
import { RedisConfiguration } from './../common/redisConfig';

const MULTIPLY_TIME_TO_KEEP_SESSION_INFORMATION: number = 2;

enum Method {
  GET,
  SET,
}

export class RedisUtility {
  public static setKey(
    config: RedisConfiguration,
    key: string,
    value: string,
  ): Promise<any> {
    return RedisUtility.redisStoreExecute(config, Method.SET, key, value);
  }

  public static getKey(config: RedisConfiguration, key: string): Promise<any> {
    return RedisUtility.redisStoreExecute(config, Method.GET, key);
  }

  public static async redisStoreExecute(
    config: RedisConfiguration,
    operation: Method,
    key: string,
    value?: string,
  ): Promise<any> {
    const client = redis.createClient(config.port, config.host, {
      usePromise: true,
      database: 0,
    });
    return new Promise((resolve, reject) => {
      client.on('connect', () => {
        console.log('redis connected!');
        let redisOperationList;
        if (operation === Method.GET) {
          redisOperationList = [
            client.multi(),
            client.get(key),
            client.expire(
              key,
              config.keyExpireInSecond *
                MULTIPLY_TIME_TO_KEEP_SESSION_INFORMATION,
            ),
            client.exec(),
          ];
        }
        if (operation === Method.SET) {
          redisOperationList = [
            client.multi(),
            client.set(key, value),
            client.expire(
              key,
              config.keyExpireInSecond *
                MULTIPLY_TIME_TO_KEEP_SESSION_INFORMATION,
            ),
            client.exec(),
          ];
        }
        Promise.all(redisOperationList)
          .then(res => {
            try {
              if (operation === Method.GET) {
                console.log('transactions:', res);
                resolve(res[1][1]);
              } else {
                console.log('transactions:', res);
                resolve(res);
              }
              return client.quit();
            } catch (err) {
              reject(err);
              return client.quit();
            }
          })
          .then(res => {
            console.log('redis client quit:', res);
          })
          .catch(err => {
            console.error(err);
            reject(new Error('REDISERR01', 'redisError'));
          });
      });
    });
  }
}
