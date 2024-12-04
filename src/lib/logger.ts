/* eslint-disable @typescript-eslint/no-explicit-any */
import winston from 'winston';

interface CustomLogger extends winston.Logger {
    logEnterFlow: (serviceName: string) => void;
    logExitFlow: (serviceName: string, payload: any) => void;
    logErrorFlow: (error: any) => void;
}

// Define the logger configuration and types
const logger: CustomLogger = winston.createLogger({
    level: 'http',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
}) as CustomLogger;

// Add console transport if not in production environment
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.json()),
        }),
    );
}

logger.logEnterFlow = (service: string) => {
    logger.info(`Entering ${service} flow}`);
};

logger.logExitFlow = (service: string, payload: object = {}) => {
    logger.info(`Exiting ${service} flow`);
    if (Object.keys(payload).length > 0) {
        logger.debug(`\n Payload: ${payload}`);
    }
};

logger.logErrorFlow = (error: any) => {
    logger.error(`Error in flow ${error.flowName}: ${error.message || error}`, {
        stack: error.stack || 'No stack available',
    });
};

export default logger;
