import { config } from "dotenv";
import { resolve } from "path";
import App from "./app";
import logger from "./shared/logger";

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

const app = new App()
app.run(environment);
