import Api from "./api";

export default class BinaceApi extends Api {
    constructor() {
        super("'wss://stream.binance.com:9443/ws/'");
    }

    static create() {
        return new BinaceApi();
    }

    subscribe(symbol, cb) {
      let ws = super.subscribe(symbol, cb);
      ws.socket.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}));
    }
}