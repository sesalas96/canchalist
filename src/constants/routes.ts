import config from '@src/config';

export const ROUTES = {
    BASE: `/${config.repository}-${config.env}/v1/`,
    API_DOCS: '/api-docs',
    USERS: {
        BASE: '/users',
        BY_ID: '/users/:id',
        REGISTER: '/users/register', // Registro de usuarios
        LOGIN: '/users/login', // Inicio de sesión
    },
    GROUPS: {
        BASE: '/groups',
        BY_ID: '/groups/:id', // Obtener detalles de un grupo
        JOIN: '/groups/:id/join', // Unirse a un grupo
        MEMBERS: '/groups/:id/members', // Listar miembros de un grupo
    },
    MATCHES: {
        BASE: '/groups/:groupId/matches', // Mejengas en un grupo
        BY_ID: '/groups/:groupId/matches/:matchId', // Detalles de una mejenga específica
        JOIN: '/groups/:groupId/matches/:matchId/join', // Unirse a una mejenga
    },
    MISC: {
        HEALTHCHECK: '/healthcheck',
        PING: '/ping',
    },
};
