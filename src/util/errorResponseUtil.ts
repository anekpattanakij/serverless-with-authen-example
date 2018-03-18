import * as ErrorSet from '../common/error';
import * as ResponseRequestSet from '../common/responseRequest';

export const errorToHttpStatusCode = (
  error: any,
): ResponseRequestSet.ResponseRequest => {
  const returnErrorResponse: ResponseRequestSet.ResponseRequest = new ResponseRequestSet.ResponseRequest(
    ResponseRequestSet.HTTP_REQUEST_SUCCESS,
    '',
  );
  if (!error) {
    returnErrorResponse.statusCode = ResponseRequestSet.HTTP_REQUEST_SUCCESS;
    return returnErrorResponse;
  } else {
    // If found error, set to error header 500 as default
    returnErrorResponse.statusCode = ResponseRequestSet.HTTP_REQUEST_FAIL;
  }

  if (error instanceof ErrorSet.Error) {
    // Set http status code by error type
    if (error.code === ErrorSet.ERROR_CODE_INVALID_INPUT) {
      returnErrorResponse.statusCode =
        ResponseRequestSet.HTTP_REQUEST_UNPROCESSABLE_ENTITY;
    }
    if (
      error.code === ErrorSet.ERROR_CODE_MYSQL_CONNECTION ||
      error.code === ErrorSet.ERROR_CODE_REDIS_CONNECTION
    ) {
      returnErrorResponse.statusCode = ResponseRequestSet.HTTP_REQUEST_FAIL;
    }
    if (
      error.code === ErrorSet.ERROR_CODE_USER_DUPLICATE_EMAIL
    ) {
      returnErrorResponse.statusCode = ResponseRequestSet.HTTP_REQUEST_UNPROCESSABLE_ENTITY;
    }

    
    returnErrorResponse.body = JSON.stringify({ code: error.code, message: error.message }) ;
  } else {
    returnErrorResponse.statusCode = ResponseRequestSet.HTTP_REQUEST_FAIL;
  }
  return returnErrorResponse;
};
