import WS from './ws'

export default class Api {

  withTimeout(timeout) {
    this.timeout = timeout;
    return this;
  }

  withMaxAttempts(maxAttempts) {
    this.maxAttempts = maxAttempts;
    return this;
  }

  constructor(url) {
    this._baseUrl = url;
    this.timeout = 5e3;
    this.maxAttempts = 5;
    this.subscription = {};
  }

  subscribe(cb, path) {
    let ws;
    try {
      if (this.subscription[path]) {
        return this.subscription[path];
      }
      ws = new WS(path, {
        timeout: this.timeout,
        maxAttempts: this.maxAttempts,
        onopen: e => console.log('Connected!', e),
        onmessage: e => cb(JSON.parse(e.data)),
        onreconnect: e => console.log('Reconnecting...', e),
        onmaximum: e => console.log('Stop Attempting!', e),
        onclose: e => { console.log('Closed!', e); this.removeSubscription(e.endpoint) },
        onerror: e => console.log('Error:', e)
      });
      this.subscription[path] = ws
      return ws
    }
    catch (ex) {
      console.log("Error :" + ex)
    }
  }

  removeSubscription(endpoint) {
    if (this.subscription[endpoint]) {
      delete this.subscription[endpoint]
    }
  }
  closeSubscription(path) {
    const ws = this.subscription[path];
    if (ws) {
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