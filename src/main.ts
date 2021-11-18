import { config } from "dotenv";
import { resolve } from "path";
import App from "./app";
import logger from "./shared/logger";
import { StockService, EmailQueueService, UserEmailService, StockThresholdService } from "./services";

declare global {
    namespace NodeJS {
        interface Global {
            [key: string]: any
        }
    }
}

const environment = process.env.NODE_ENV;
const { error } = config({
    path: resolve(__dirname, '../', `.env.${environment}`)
});

if (error) {
    throw new Error(error.message);
}

global.logger = logger;

const app = new App(
    new StockService(),
    new UserEmailService(),
    new EmailQueueService(),
    new StockThresholdService
);

app.run(() => {
    global.logger.log({
        level: 'info',
        message: `Job running in ${environment} mode`,
        skip: true
    });
});
