import Api from "./api";

export default class MultiRegisteredSymbolApi extends Api {
    constructor(url){
        super(url);
        this.symbols = [];
    }

    subscribe(eventHandler, symbol) {
        const socket = super.subscribe(eventHandler, this._baseUrl);
        if(this.symbols[symbol]){
            return socket;
        }

        socket.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}));
        this.symbols[symbol] = socket;
    }
}