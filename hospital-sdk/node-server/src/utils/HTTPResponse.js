const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  METHOD_NOT_ALLOWED: 405,
};

const HTTPResponse = {
  OK: (res, data) => {
    res.status(StatusCodes.OK).json(data);
  },

  METHOD_NOT_ALLOWED: (res, data) => {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).json(data);
  },

  CREATED: (res, data) => {
    res.status(StatusCodes.CREATED).json(data);
  },

  BAD_REQUEST: (res, data) => {
    res.status(StatusCodes.BAD_REQUEST).json(data);
  },

  UNAUTHORIZED: (res, data) => {
    res.status(StatusCodes.UNAUTHORIZED).json(data);
  },

  FORBIDDEN: (res, data) => {
    res.status(StatusCodes.FORBIDDEN).json(data);
  },

  NOT_FOUND: (res, data) => {
    res.status(StatusCodes.NOT_FOUND).json(data);
  },

  INTERNAL_SERVER_ERROR: (res, data) => {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(data);
  },
};

export { HTTPResponse, StatusCodes };
