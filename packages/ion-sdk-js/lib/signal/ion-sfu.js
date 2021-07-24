"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class IonSFUJSONRPCSignal {
    constructor(uri) {
        this.socket = new WebSocket(uri);
        this.socket.addEventListener('open', () => {
            if (this._onopen)
                this._onopen();
        });
        this.socket.addEventListener('error', (e) => {
            if (this._onerror)
                this._onerror(e);
        });
        this.socket.addEventListener('close', (e) => {
            if (this._onclose)
                this._onclose(e);
        });
        this.socket.addEventListener('message', async (event) => {
            const resp = JSON.parse(event.data);
            if (resp.method === 'offer') {
                if (this.onnegotiate)
                    this.onnegotiate(resp.params);
            }
            else if (resp.method === 'trickle') {
                if (this.ontrickle)
                    this.ontrickle(resp.params);
            }
        });
    }
    join(sid, offer) {
        const id = uuid_1.v4();
        this.socket.send(JSON.stringify({
            method: 'join',
            params: { sid, offer },
            id,
        }));
        return new Promise((resolve, reject) => {
            const handler = (event) => {
                const resp = JSON.parse(event.data);
                if (resp.id === id) {
                    if (resp.error)
                        reject(resp.error);
                    else
                        resolve(resp.result);
                    this.socket.removeEventListener('message', handler);
                }
            };
            this.socket.addEventListener('message', handler);
        });
    }
    trickle(trickle) {
        this.socket.send(JSON.stringify({
            method: 'trickle',
            params: trickle,
        }));
    }
    offer(offer) {
        const id = uuid_1.v4();
        this.socket.send(JSON.stringify({
            method: 'offer',
            params: { desc: offer },
            id,
        }));
        return new Promise((resolve, reject) => {
            const handler = (event) => {
                const resp = JSON.parse(event.data);
                if (resp.id === id) {
                    if (resp.error)
                        reject(resp.error);
                    else
                        resolve(resp.result);
                    this.socket.removeEventListener('message', handler);
                }
            };
            this.socket.addEventListener('message', handler);
        });
    }
    answer(answer) {
        this.socket.send(JSON.stringify({
            method: 'answer',
            params: { desc: answer },
        }));
    }
    close() {
        this.socket.close();
    }
    set onopen(onopen) {
        if (this.socket.readyState === WebSocket.OPEN) {
            onopen();
        }
        this._onopen = onopen;
    }
    set onerror(onerror) {
        this._onerror = onerror;
    }
    set onclose(onclose) {
        this._onclose = onclose;
    }
}
exports.default = IonSFUJSONRPCSignal;
