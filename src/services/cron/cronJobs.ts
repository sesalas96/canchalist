/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import logger from '@src/lib/logger';
import Subscription from '@src/models/11_Subscription';
import cron from 'node-cron';

// Tarea programada: desactivar suscripciones expiradas
cron.schedule('0 0 * * *', async () => {
    try {
        const result: any = await Subscription.updateMany(
            { endDate: { $lt: new Date() }, isActive: true },
            { isActive: false },
        );
        logger.info(`Expired subscriptions deactivated: ${result.nModified}`);
    } catch (error) {
        logger.error('Error deactivating expired subscriptions:', error);
    }
});

// // Tarea programada para cada minuto (para pruebas)
// cron.schedule('* * * * *', () => {
//     console.log('Ejecutando tarea cada minuto.');
// });

console.log('Cron job for subscription expiration initialized.');
