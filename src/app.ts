import { IDatabaseConnectionOptions } from "./shared/interfaces";
import { sequelize } from "./models";
export default class App {

    constructor() {
        this.createDatabaseConnection({
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10)
        });
    }

    async createDatabaseConnection(connOptions: IDatabaseConnectionOptions) {
        try {

            await sequelize(connOptions);

        } catch (error) {
            global.logger.log({
                level: "error",
                message: "Error connecting to database",
                detail: error.message
            })
        }
    }

    run(environment: string) {
        global.logger.log({
            level: 'info',
            message: `Server running in ${environment} mode`,
            skip: true
        })
    }

}
