import { EmailQueue, StockThreshold } from "../models";
import { IStockDetail } from '../shared/interfaces';
export class EmailQueueService {

    async updateEmailQueue(userStocks: StockThreshold[], stocks: IStockDetail[]) {
        for (const user of userStocks) {
            const stock = stocks.find(s => s.StockSymbol == user.getDataValue('symbol'));
            if (stock !== null) {
                if (user.getDataValue('threshold') <= stock.ClosingPrice) {
                    await EmailQueue.create({ stockthresholdid: user.getDataValue('stockThresholdId'), status: 'Ready' })
                }
            }
        }
    }
}