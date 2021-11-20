import { IDatabaseConnectionOptions, IStock } from "./shared/interfaces";
import { sequelize } from "./models";
import { StockService, UserEmailService, EmailQueueService, StockThresholdService } from "./services";

export default class App {

    constructor(private stockService: StockService,
        private userEmailService: UserEmailService,
        private emailQueueService: EmailQueueService,
        private stockThresholdService: StockThresholdService
    ) {
        this.init();
    }

    async init() {
        await this.createDatabaseConnection({
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10)
        });
        await this.addEmailQueue();
        await this.processEmailQueue();
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

    run(cb: () => void) {
        cb();
    }

    async addEmailQueue() {
        try {
            const apiDatas = await this.stockService.getTodayStockPrice();
            const userStocks = await this.stockThresholdService.getStockDetails();

            await this.emailQueueService.updateEmailQueue(userStocks, apiDatas.d);
        } catch (error) {
            global.logger.log({
                level: "error",
                message: "Error processing Email Queue",
                detail: error.message
            })
        }

    }

    async processEmailQueue() {
        try {
            const users = await this.userEmailService.getUsersDetail();
            await this.emailQueueService.sendMail(users);
        } catch (error) {
            global.logger.log({
                level: "error",
                message: "Error sending mails",
                detail: error.message
            });
        }
    }

}
