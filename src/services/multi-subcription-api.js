import Api from "./api";
export default class MultiSubcriptionApi extends Api {
    constructor(url){
        super(url);
        this.subscription = {};
        this.streams = {};
    }

    caller(fname, ...args) {
        return this.streams[fname].call(null, ...args)
    }

    removeSubscription(endpoint){
        if(this.subscription[endpoint]) {
          delete this.subscription[endpoint]
        }
      }
      closeSubscription(type, isCombined = false, ...args) {
        const endpoint = this.caller(type, ...args);
        const path = (isCombined ? this._combinedBaseUrl : this._baseUrl) + endpoint;
        const ws = this.subscription[path];
        if(ws) {
          ws.close(1000, "");
        }
      }
      closeAll() {
        for (const key in this.subscription) {
          this.subscription[key].close();
          delete this.subscription[key]
        }
        this.subscription = {}
      }
}