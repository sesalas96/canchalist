import config from '@src/config';

export const ROUTES = {
    BASE: `/${config.repository}-${config.env}/v1`,
    API_DOCS: '/api-docs',
    USERS: {
        BASE: '/users',
        BY_ID: '/users/:id',
        REGISTER: '/users/register', // Registro de usuarios
        LOGIN: '/users/login', // Inicio de sesión
        RESTORE: '/users/:id/restore', // Recuperar un usuario
    },
    GROUPS: {
        BASE: '/groups',
        BY_ID: '/groups/:id', // Obtener detalles de un grupo
        JOIN: '/groups/:id/join', // Unirse a un grupo
        MEMBERS: '/groups/:id/members', // Listar miembros de un grupo
        RESTORE: '/groups/:id/restore', // Recuperar un grupo
    },
    MATCHES: {
        BASE: '/groups/:groupId/matches', // Mejengas en un grupo
        BY_ID: '/groups/:groupId/matches/:matchId', // Detalles de una mejenga específica
        JOIN: '/groups/:groupId/matches/:matchId/join', // Unirse a una mejenga
        RESTORE: '/groups/:groupId/matches/:matchId/restore', // Recuperar una mejenga
    },
    MISC: {
        HEALTHCHECK: '/healthcheck',
        PING: '/ping',
    },
};
