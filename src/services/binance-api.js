import Api from "./api";

export default class BinanceApi extends Api {

  withCombinedBaseUrl(_combinedBaseUrl) {
    this._combinedBaseUrl = _combinedBaseUrl;
    return this;
  }
  static create(url){
    return new BinanceApi(url);
  }
  constructor(url) {
    super(url);
    this._combinedBaseUrl = '';
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
  }
  subscribe(cb, endpoint, isCombined = false) {
    let path = (isCombined ? this._combinedBaseUrl : this._baseUrl) + endpoint;
    return super.subscribe(cb, path);
  }
  
  caller(fname, ...args) {
    return this.streams[fname].call(null, ...args)
  }

  closeSubscription(type, isCombined = false, ...args) {
    const endpoint = this.caller(type, ...args);
    const path = (isCombined ? this._combinedBaseUrl : this._baseUrl) + endpoint;
    super.closeSubscription(path);
  }

  onDepthUpdate(symbol, eventHandler) {
    return this.subscribe(eventHandler, this.streams.depth(symbol));
  }

  onDepthLevelUpdate(symbol, level, eventHandler) {
    return this.subscribe(eventHandler, this.streams.depthLevel(symbol, level));
  }

  onKline(symbol, interval, eventHandler) {
    return this.subscribe(eventHandler, this.streams.kline(symbol, interval));
  }

  onAggTrade(symbol, eventHandler) {
    return this.subscribe(eventHandler, this.streams.aggTrade(symbol));
  }

  onTrade(symbol, eventHandler) {
    return this.subscribe(eventHandler, this.streams.trade(symbol));
  }

  onTicker(symbol, eventHandler) {
    return this.subscribe(eventHandler, this.streams.ticker(symbol));
  }
  onMiniTicker(symbol, eventHandler) {
    return this.subscribe(eventHandler, this.streams.miniTicker(symbol));
  }
  onAllMiniTickers(eventHandler) {
    return this.subscribe(eventHandler, this.streams.allMiniTicker());
  }
  onAllTickers(eventHandler) {
    return this.subscribe(eventHandler, this.streams.allTickers());
  }
  onCombinedStream(streams, eventHandler) {
    return this.subscribe(eventHandler, streams.join('/'), true);
  }
}