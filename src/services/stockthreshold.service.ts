import { StockThreshold } from '../models';
export class StockThresholdService {

    async getStockDetails() {
        return await StockThreshold.findAll({
            attributes: ['symbol', 'threshold', ['stockthresholdid', 'stockThresholdId']],
            where: { deletedat: null }
        });
    }
}