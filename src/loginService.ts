import { sha3_512 } from 'js-sha3';
import * as jwt from 'jsonwebtoken';
import { thunk } from 'thunks';
import { Error } from './common/error';
import { User } from './common/user';
import { Config } from './config/index';
import { UserUtil } from './dataLayer/userUtil';
import { RedisUtility } from './util/redisUtil';

const JWT_SIGNATURE_POSITION: number = 2;
const WAIT_TIME = 1000;

export const login = async (event, context, callback) => {
  // console.log('EMAIL_SERVICE_API_KEY: ', process.env.EMAIL_SERVICE_API_KEY);
  let hasError: boolean = false;
  let response;

  if (event.body) {
    try {
      // store token in redis as session
      const getUser: User = await UserUtil.getUser(
        Config.MYSQL_CONFIGURATION,
        event.body.userid,
      ).catch(error => {
        hasError = true;
        throw error;
      });
      if (sha3_512(event.body.password) !== getUser.password) {
        throw new Error('USERERR1', 'Password not match');
      }

      const token: string = jwt.sign(
        getUser.toPlainObject(),
        Config.SIGN_TOKEN,
      );
      const tokenSignature = token.split('.')[JWT_SIGNATURE_POSITION];

      await RedisUtility.setKey(
        Config.REDIS_CONFIGURATION,
        tokenSignature,
        '',
      ).catch(error => {
        hasError = true;
        throw error;
      });

      // store token in redis as session
      if (!hasError) {
        response = {
          statusCode: 200,
          body: { token },
        };
      }
      if (response === undefined) {
        response = {
          statusCode: 400,
          body: { errorCode: 'Invalid input' },
        };
      }
    } catch (error) {
      let returnErrorResponse;
      if (error instanceof Error) {
        returnErrorResponse = error.toPlainObject();
      } else {
        returnErrorResponse = { errorCode: 'Invalid input' };
      }
      response = {
        statusCode: 400,
        body: returnErrorResponse,
      };
    }
  } else {
    response = {
      statusCode: 400,
      body: { errorCode: 'Invalid input' },
    };
  }

  callback(null, response);
};
