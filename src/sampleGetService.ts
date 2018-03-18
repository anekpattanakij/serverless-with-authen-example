export const getMessage = (event, context, callback): void => {
  const response = {
    statusCode: 200,
    body: { inputparams: event.query },
  };

  callback(null, response);
};
