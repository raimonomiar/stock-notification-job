import https from 'https';
import { IStock } from '../shared/interfaces';
export class StockService {

    async getTodayStockPrice(): Promise<IStock> {
        const body = {
            fromdate: "",
            toDate: "",
            stockSymbol: "",
            offset: 1,
            limit: process.env.STOCK_LIMIT
        };

        const url = process.env.STOCK_API;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        let data: Uint8Array[] = [];
        return new Promise((resolve, reject) => {
            const request = https.request(url, options, response => {
                response.on('data', chunk => {
                    data.push(chunk);
                });

                response.on('end', () => {
                    resolve(JSON.parse(Buffer.concat(data).toString()));
                })
                    .on('error', err => reject(err));

            });

            request.on('error', error => reject(error));
            request.write(JSON.stringify(body));
            request.end();
        })

    }


}