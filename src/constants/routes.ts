import config from '@src/config';

export const ROUTES = {
    BASE: `/${config.repository}-${config.env}/api/v1`,
    API_DOCS: '/api-docs',
    SECTION: {
        BASE: '/section',
        ENDPOINT_FUNCTION: '/section/endpoint',
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
