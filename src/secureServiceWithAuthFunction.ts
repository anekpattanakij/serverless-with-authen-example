import { authorizeService } from './authService';
import {
  HTTP_REQUEST_SUCCESS,
  ResponseRequest,
} from './common/responseRequest';

const getBnkMembers = () => {
  return [
    {
      nickname: 'Cherprang',
      full_name: 'Cherprang Areekul',
    },
    {
      nickname: 'Jennis',
      full_name: 'Jennis Oprasert',
    },
    {
      nickname: 'Miori',
      full_name: 'Miori Ohkubo',
    },
  ];
};

export const landing = (event, context, callback): void => {
  authorizeService(event, context, responseFromAuthorizer => {
    if (responseFromAuthorizer.statusCode === HTTP_REQUEST_SUCCESS) {
      const members = getBnkMembers();
      responseFromAuthorizer.body = JSON.stringify(members);
    }
    callback(null,responseFromAuthorizer.toPlainObject());
  });
};
