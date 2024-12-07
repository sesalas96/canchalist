import config from '@src/config';

export const ROUTES = {
    BASE: `/${config.repository}-${config.env}/v1`,
    API_DOCS: '/api-docs',
    MISC: {
        HEALTHCHECK: '/healthcheck',
        PING: '/ping',
    },
    USERS: {
        BASE: '/users',
        BY_ID: '/users/:id',
        REGISTER: '/users/register', // Registro de usuarios
        LOGIN: '/users/login', // Inicio de sesión
        RESTORE: '/users/:id/restore', // Recuperar un usuario
        DELETE: '/users/:id', // Eliminar un usuario (soft delete)
        LIST: '/users', // Listar todos los usuarios
        UPDATE: '/users/:id', // Actualizar información de usuario
    },
    ROLES: {
        BASE: '/roles',
        BY_ID: '/roles/:id', // Obtener detalles de un role
        RESTORE: '/roles/:id/restore', // Recuperar un role
        DELETE: '/roles/:id', // Eliminar un role (soft delete)
        LIST: '/roles', // Listar todos los role
        PATCH: '/roles/:id', // Actualizar información de un role
    },
    GROUPS: {
        BASE: '/groups',
        BY_ID: '/groups/:id', // Obtener detalles de un grupo
        JOIN: '/groups/:id/join', // Unirse a un grupo
        MEMBERS: '/groups/:id/members', // Listar miembros de un grupo
        RESTORE: '/groups/:id/restore', // Recuperar un grupo
        DELETE: '/groups/:id', // Eliminar un groupo (soft delete)
        LIST: '/groups', // Listar todos los grupos
        UPDATE: '/groups/:id', // Actualizar información de un grupo
    },
    CENTERS: {
        BASE: '/centers',
        BY_ID: '/centers/:centerId',
        RESTORE: '/centers/:centerId/restore',
        ADD_MATCH: '/centers/:centerId/matches/:matchId',
        MATCHES: '/centers/:centerId/matches',
    },
    MATCHES: {
        BASE: '/groups/:groupId/matches', // Mejengas en un grupo
        BY_ID: '/groups/:groupId/matches/:matchId', // Detalles de una mejenga específica
        JOIN: '/groups/:groupId/matches/:matchId/join', // Unirse a una mejenga
        RESTORE: '/groups/:groupId/matches/:matchId/restore', // Recuperar una mejenga
        DELETE: '/groups/:groupId/matches/:matchId', // Eliminar un groupo (soft delete)
        LEAVE: '/groups/:groupId/matches/:matchId/leave', // Recuperar una mejenga
        UPDATE: '/groups/:groupId/matches/:matchId', // Actualizar información de un grupo
    },
    PAYMENTS: {
        BASE: '/payments',
        BY_ID: '/payments/:id', // Obtener o actualizar un pago por ID
        UPDATE_STATUS: '/payments/:id/status', // Cambiar el estado de un pago
        COMPLETE: '/payments/:id/complete', // Completar un pago y registrar en la billetera
    },
    WALLET: {
        BASE: '/wallets',
        BY_USER: '/wallets/:userId', // Obtener la billetera por usuario
        ADD_FUNDS: '/wallets/:userId/add-funds', // Agregar fondos a la billetera
        DEDUCT_FUNDS: '/wallets/:userId/deduct-funds', // Deducir fondos de la billetera
        TRANSACTIONS: '/wallets/:userId/transactions', // Listar transacciones de la billetera
        CREATE: '/wallets', // Crear una billetera
    },
    HISTORIES: {
        BASE: '/histories', // Base para todas las rutas de historial
        BY_ID: '/histories/:historyId', // Obtener, actualizar o eliminar un historial por su ID
        RESTORE: '/histories/:historyId/restore', // Restaurar un historial eliminado
        LIST: '/histories', // Listar todos los historiales (opcionalmente con filtros)
    },
    REVIEWS: {
        BASE: '/reviews', // Base para crear o listar reseñas
        BY_ID: '/reviews/:reviewId', // Obtener, actualizar o eliminar una reseña por ID
        RESTORE: '/reviews/:reviewId/restore', // Restaurar una reseña eliminada
        LIST: '/reviews', // Listar todas las reseñas con filtros opcionales
    },
    NOTIFICATIONS: {
        BASE: '/notifications',
        BY_ID: '/notifications/:notificationId',
        MARK_AS_READ: '/notifications/:notificationId/read',
        USER: '/notifications/user/:userId',
        MARK_ALL_AS_READ: '/notifications/user/:userId/read-all',
    },
    PLANS: {
        BASE: '/plans',
        BY_ID: '/plans/:planId',
        RESTORE: '/plans/:planId/restore',
    },
    SUBSCRIPTIONS: {
        BASE: '/subscriptions',
        BY_ID: '/subscriptions/:subscriptionId',
        RESTORE: '/subscriptions/:subscriptionId/restore',
        USER: '/subscriptions/user/:userId',
    },
    CATALOGS: {
        BASE: '/catalogs',
        BY_ID: '/catalogs/:catalogName',
    },
};
