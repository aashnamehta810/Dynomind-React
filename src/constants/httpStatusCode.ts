interface HttpStatusCodes {
  code: number;
  constant: string;
  reasonPhrase: string;
}

export const httpStatusCodes: HttpStatusCodes[] = [
  {
    code: 200,
    constant: 'OK',
    reasonPhrase: 'OK',
  },
  {
    code: 201,
    constant: 'CREATED',
    reasonPhrase: 'Created',
  },
  {
    code: 204,
    constant: 'NO_CONTENT',
    reasonPhrase: 'No Content',
  },
  {
    code: 304,
    constant: 'NOT_MODIFIED',
    reasonPhrase: 'Not Modified',
  },
  {
    code: 400,
    constant: 'BAD_REQUEST',
    reasonPhrase: 'Bad Request',
  },
  {
    code: 401,
    constant: 'UNAUTHORIZED',
    reasonPhrase: 'Unauthorized',
  },
  {
    code: 403,
    constant: 'FORBIDDEN',
    reasonPhrase: 'Forbidden',
  },
  {
    code: 404,
    constant: 'NOT_FOUND',
    reasonPhrase: 'Not Found',
  },
  {
    code: 408,
    constant: 'REQUEST_TIMEOUT',
    reasonPhrase: 'Request Timeout',
  },
  {
    code: 429,
    constant: 'TOO_MANY_REQUESTS',
    reasonPhrase: 'Too Many Requests',
  },
  {
    code: 431,
    constant: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
    reasonPhrase: 'Request Header Fields Too Large',
  },
  {
    code: 500,
    constant: 'INTERNAL_SERVER_ERROR',
    reasonPhrase: 'Internal Server Error',
  },
  {
    code: 502,
    constant: 'BAD_GATEWAY',
    reasonPhrase: 'Bad Gateway',
  },
  {
    code: 503,
    constant: 'SERVICE_UNAVAILABLE',
    reasonPhrase: 'Service Unavailable',
  },
  {
    code: 504,
    constant: 'GATEWAY_TIMEOUT',
    reasonPhrase: 'Gateway Timeout',
  },
];
