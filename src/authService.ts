import * as jwk from 'jsonwebtoken';
import { Error } from './common/error';
import {
  HTTP_REQUEST_FAIL,
  HTTP_REQUEST_SUCCESS,
  HTTP_REQUEST_UNAUTHORIZE,
  ResponseRequest,
} from './common/responseRequest';
import { Config } from './config/index';
import { RedisUtility } from './util/redisUtil';

export const authorizeService = async (
  event,
  context,
  callback: (n: ResponseRequest) => any,
) => {
  console.log(event);
  console.log('Auth function invoked');
  const response: ResponseRequest = new ResponseRequest(
    HTTP_REQUEST_SUCCESS,
    '',
  );
  // check Authorization in header
  try {
    if (event.headers.bearer) {
      // Remove 'bearer ' from token:
      const token = event.headers.bearer;
      // verify token first
      try {
        console.log('token to decrupt : '+ token);
        const decoded = jwk.verify(token, Config.SIGN_TOKEN);
        const resultInStore = await RedisUtility.getKey(
          Config.REDIS_CONFIGURATION,
          token,
        );
        if (resultInStore) {
          response.statusCode = HTTP_REQUEST_SUCCESS;
          response.body = 'pass';
        } else {
          response.statusCode = HTTP_REQUEST_UNAUTHORIZE;
          response.body = JSON.stringify(
            new Error('ERR_INVALID_TOKEN', 'Invalid token not in store'),
          );
          callback(response);
        }
      } catch (err) {
        console.log('Invalid token.');
        response.statusCode = HTTP_REQUEST_UNAUTHORIZE;
        response.body = JSON.stringify(
          new Error('ERR_INVALID_TOKEN', 'Invalid token FAIL on verify.'),
        );
        callback(response);
      }
    } else {
      console.log('No authorizationToken found in the header.');
      response.statusCode = HTTP_REQUEST_UNAUTHORIZE;
      response.body = JSON.stringify(
        new Error(
          'ERR_NO_AUTHORIZE_TOKEN_HEADER',
          'No authorizationToken found in the header.',
        ),
      );
      callback(response);
    }
  } catch (err) {
    console.log(err);
    response.statusCode = HTTP_REQUEST_FAIL;
    response.body = JSON.stringify(
      new Error('ERR_SYSTEM_ERROR', 'Error in authservice.'),
    );
    callback(response);
  }
};
