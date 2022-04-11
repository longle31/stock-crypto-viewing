import store from '../store'
import BinanceApi from './binance-api';

const binanceApi = BinanceApi.create('wss://stream.binance.com:9443/ws/')
                  .withCombinedBaseUrl('wss://stream.binance.com:9443/stream?streams=');

const subscribeSymbol = function(symbol) {
  binanceApi.onTicker(symbol,(ticker) => {
    const tick = {
      price: parseFloat(ticker.c),
      vol: parseFloat(ticker.q).toFixed(2),
      percent: parseFloat(ticker.P).toFixed(2),
      chg: ticker.p,
      high: ticker.h,
      low: ticker.l,
      open: ticker.o,
      time:ticker.E,
      symbol: symbol
    };
    store.commit('UPDATE_TICKER', tick)
  })
};
const unSubscribeSymbol = function(symbol) {
  binanceApi.closeSubscription('ticker',false, symbol)
};

const subscribeChart = function(symbol, interval) {
  binanceApi.onKline(symbol, interval, () => {})
};
const unSubscribeChart = function(symbol, interval) {
  binanceApi.closeSubscription('kline',false, symbol, interval)
}
export {subscribeSymbol, unSubscribeSymbol, subscribeChart, unSubscribeChart}