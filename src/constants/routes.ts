import config from '@config';

export const ROUTES = {
  API_BASE_URL: config.API_BASE_URL,
  USERS: {
    BASE: '/users',
    BY_ID: '/users/:id',
  },
  MISC: {
    HEALTHCHECK: '/healthcheck',
    PING: '/ping',
  },
};
