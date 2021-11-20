import { EmailQueue, StockThreshold, UserEmail } from "../models";
import { IStockDetail } from '../shared/interfaces';
import { NodeMailer } from '../shared/extensions';
export class EmailQueueService {

    async updateEmailQueue(userStocks: StockThreshold[], stocks: IStockDetail[]) {
        for (const user of userStocks) {
            const queueExists = EmailQueue.findOne({
                attributes: ['emailqueueid'],
                where: { deletedat: null, status: 'Ready', stockthresholdid: user.getDataValue('stockThresholdId') }
            });

            if (queueExists == null) {
                const stock = stocks.find(s => s.StockSymbol == user.getDataValue('symbol'));
                if (stock !== null) {
                    if (user.getDataValue('threshold') <= stock.ClosingPrice) {
                        await EmailQueue.create({ stockthresholdid: user.getDataValue('stockThresholdId'), status: 'Ready' });
                    }
                }
            }

        }
    }

    async sendMail(users: UserEmail[]) {
        const mailer = new NodeMailer();
        const queues = await EmailQueue.findAll({
            attributes: ['stockthresholdid', 'emailqueueid'],
            include: [{
                association: 'stock',
                attributes: ['useremailid', 'symbol', 'threshold'],
                where: { deletedat: null }
            }],
            where: { deletedat: null, status: 'Ready' }
        });

        for (const queue of queues) {
            const user = users.find(u => u.getDataValue('useremailid') == queue.getDataValue('stock').useremailid);

            mailer.sendMail({
                from: process.env.SMTP_USER,
                to: user.getDataValue('email'),
                subject: 'Stock Notification',
                text: `Hi, \rThe share ${queue.getDataValue('stock').symbol} has exceeded ${queue.getDataValue('stock').threshold} closing price.`
            }).then(async (info) => {
                global.logger.log({
                    level: 'info',
                    message: `Sent mail to ${user.getDataValue('email')}`,
                    detail: `Info: ${info.messageId}`
                });
                EmailQueue.update({ status: 'Completed' }, { where: { emailqueueid: queue.getDataValue('emailqueueid') } });
            }).catch(async (error) => {
                global.logger.log({
                    level: 'error',
                    message: `Error sending mail to ${user.getDataValue('email')}`,
                    detail: `${error}`
                });

                EmailQueue.update({ status: 'Failed' }, { where: { emailqueueid: queue.getDataValue('emailqueueid') } });
            });



        }
    }


}