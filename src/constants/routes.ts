import config from '@config';

export const ROUTES = {
    BASE_PATH_V1: '/api/v1',
    SECTION: {
        BASE: '/section',
        ENDPOINT_FUNCTION: '/endpoint',
    },
    USERS: {
        BASE: '/users',
        BY_ID: '/users/:id',
    },
    MISC: {
        HEALTHCHECK: '/healthcheck',
        PING: '/ping',
    },
};
