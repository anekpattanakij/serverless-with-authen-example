import { sha3_512 } from 'js-sha3';
import * as jwt from 'jsonwebtoken';
import { thunk } from 'thunks';
import * as validator from 'validator';
import {
  Error,
  ERROR_CODE_INVALID_INPUT,
  ERROR_CODE_MYSQL_CONNECTION,
  ERROR_CODE_REDIS_CONNECTION,
  ERROR_CODE_USER_DUPLICATE_EMAIL,
} from './common/error';
import {
  HTTP_REQUEST_SUCCESS,
  ResponseRequest,
} from './common/responseRequest';
import { User } from './common/user';
import { Config } from './config/index';
import { UserUtil } from './dataLayer/userUtil';
import { errorToHttpStatusCode } from './util/errorResponseUtil';
import { RedisUtility } from './util/redisUtil';

const JWT_SIGNATURE_POSITION: number = 2;
const WAIT_TIME = 1000;

export const register = async (event, context, callback) => {
  // console.log('EMAIL_SERVICE_API_KEY: ', process.env.EMAIL_SERVICE_API_KEY);
  let response: ResponseRequest = new ResponseRequest(HTTP_REQUEST_SUCCESS, '');
  let inputObject: any;
  try {
    if (!event.body) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Invalid input');
    }

    try {
      inputObject = JSON.parse(event.body);
    } catch (err) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Error on convert json');
    }
    console.log('temp1');
    if (
      !inputObject.email ||
      !validator.isEmail(inputObject.email) ||
      !inputObject.password ||
      validator.isEmpty(inputObject.password) ||
      !inputObject.displayName ||
      validator.isEmpty(inputObject.displayName)
    ) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Invalid input');
    }
    // TODO Check for input format
    console.log('temp2');
    const returnUserToken: User = new User(
      0,
      inputObject.displayName,
      inputObject.email,
      sha3_512(inputObject.password),
      1,
    );
    const token: string = jwt.sign(
      JSON.stringify(returnUserToken.toPlainObject()),
      Config.SIGN_TOKEN,
    );
    const tokenSignature = token.split('.')[JWT_SIGNATURE_POSITION];

    // store token in redis as session
    const currentDate: Date = new Date();
    await RedisUtility.setKey(
      Config.REDIS_CONFIGURATION,
      tokenSignature,
      '' +
        currentDate.setSeconds(
          currentDate.getSeconds() + Config.SESSION_TIMEOUT_SECOND,
        ),
    ).catch(error => {
      throw new Error(ERROR_CODE_REDIS_CONNECTION, JSON.stringify(error));
    });
    // Save user to database
    const checkExistingUser: User = await UserUtil.getUser(
      Config.MYSQL_CONFIGURATION,
      returnUserToken.email,
    ).catch(error => {
      throw new Error(ERROR_CODE_MYSQL_CONNECTION, JSON.stringify(error));
    });
    // If duplicate user return error
    if (checkExistingUser) {
      throw new Error(
        ERROR_CODE_USER_DUPLICATE_EMAIL,
        'this user already exist',
      );
    } else {
      await UserUtil.saveUser(
        Config.MYSQL_CONFIGURATION,
        returnUserToken,
      ).catch(error => {
        throw new Error(ERROR_CODE_MYSQL_CONNECTION, JSON.stringify(error));
      });
    }
    // if pass all, put success response
    response.statusCode = HTTP_REQUEST_SUCCESS;
    response.body = JSON.stringify({ token });
  } catch (error) {
    console.log(error);
    response = errorToHttpStatusCode(error);
  }
  callback(null, response);
};
