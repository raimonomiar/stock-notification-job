export interface IStock {
    d: IStockDetail []
}

export interface IStockDetail {
    StockSymbol: string,
    ClosingPrice: number
}