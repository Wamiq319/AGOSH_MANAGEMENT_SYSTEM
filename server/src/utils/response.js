export const sendResponse = (res, options, statusCode = 200) => {
  const response = {
    success: options.success,
    message: options.message,
    data: options.data ?? {},
    errors: options.errors,
    meta: options.meta,
  };

  return res.status(statusCode).json(response);
};
