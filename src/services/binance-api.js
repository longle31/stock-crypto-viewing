import Api from "./api";

export default class BinaceApi extends Api {
    constructor() {
        super("'wss://stream.binance.com:9443/ws/'");
        this._combinedBaseUrl = 'wss://stream.binance.com:9443/stream?streams=';
        this.streams = {
            depth: (symbol) => `${symbol.toLowerCase()}@depth`,
            depthLevel: (symbol, level) => `${symbol.toLowerCase()}@depth${level}`,
            kline: (symbol, interval) => `${symbol.toLowerCase()}@kline_${interval}`,
            aggTrade: (symbol) => `${symbol.toLowerCase()}@aggTrade`,
            trade: (symbol) => `${symbol.toLowerCase()}@trade`,
            ticker: (symbol) => `${symbol.toLowerCase()}@ticker`,
            miniTicker: (symbol) => `${symbol.toLowerCase()}@miniTicker`,
            allMiniTicker: () => `!miniTicker@arr`,
            allTickers: () => '!ticker@arr'
        };
        this.subscription = {};
    }

    static create() {
        return new BinaceApi();
    }

    caller(fname, ...args) {
        return this.streams[fname].call(null, ...args)
    }

    onDepthUpdate(symbol, eventHandler) {
        return this.subscribe(eventHandler, this.this.streams.depth(symbol));
    }
    onDepthLevelUpdate(symbol, level, eventHandler) {
        return this.subscribe(eventHandler, this.this.streams.depthLevel(symbol, level));
    }
    onKline(symbol, interval, eventHandler) {
        return this.subscribe(eventHandler, this.this.streams.kline(symbol, interval));
    }
    onAggTrade(symbol, eventHandler) {
        return this.subscribe(eventHandler, this.this.streams.aggTrade(symbol));
    }
    onTrade(symbol, eventHandler) {
        return this.subscribe(eventHandler, this.this.streams.trade(symbol));
    }
    onTicker(symbol, eventHandler) {
        return this.subscribe(eventHandler, this.this.streams.ticker(symbol));
    }
    onMiniTicker(symbol, eventHandler) {
        return this.subscribe(eventHandler, this.this.streams.miniTicker(symbol));
    }
    onAllMiniTickers(eventHandler) {
        return this.subscribe(eventHandler, this.this.streams.allMiniTicker());
    }
    onAllTickers(eventHandler) {
        return this.subscribe(eventHandler, this.this.streams.allTickers());
    }
    onCombinedStream(streams, eventHandler) {
        return this.subscribe(eventHandler, streams.join('/'), true);
    }
}