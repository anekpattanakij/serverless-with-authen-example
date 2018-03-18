import { HTTP_REQUEST_SUCCESS, ResponseRequest } from './common/responseRequest';

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

export const bnkMember = (event, context, callback): void => {
  const members = getBnkMembers();
  const response:ResponseRequest = new ResponseRequest(HTTP_REQUEST_SUCCESS,JSON.stringify(members));

  callback(null, response.toPlainObject());
};
