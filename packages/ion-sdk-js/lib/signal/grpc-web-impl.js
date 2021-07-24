"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IonSFUGRPCWebSignal = void 0;
const uuid_1 = require("uuid");
const events_1 = require("events");
const grpc_web_1 = require("@improbable-eng/grpc-web");
const sfu_pb_service_1 = require("./_proto/library/sfu/sfu_pb_service");
const sfu_pb_1 = require("./_proto/library/sfu/sfu_pb");
const pb = require("./_proto/library/sfu/sfu_pb");
const utils_1 = require("./utils");
class IonSFUGRPCWebSignal {
    constructor(uri) {
        this._event = new events_1.EventEmitter();
        this.client = new sfu_pb_service_1.SFUClient(uri, {
            transport: grpc_web_1.grpc.WebsocketTransport(),
        });
        this.streaming = this.client.signal();
        this.streaming.on('data', (reply) => {
            var _a;
            switch (reply.getPayloadCase()) {
                case sfu_pb_1.SignalReply.PayloadCase.JOIN:
                    const answer = JSON.parse(utils_1.Uint8ArrayToJSONString((_a = reply.getJoin()) === null || _a === void 0 ? void 0 : _a.getDescription()));
                    this._event.emit('join-reply', answer);
                    break;
                case sfu_pb_1.SignalReply.PayloadCase.DESCRIPTION:
                    const desc = JSON.parse(utils_1.Uint8ArrayToJSONString(reply.getDescription()));
                    if (desc.type === 'offer') {
                        if (this.onnegotiate)
                            this.onnegotiate(desc);
                    }
                    else if (desc.type === 'answer') {
                        this._event.emit('description', desc);
                    }
                    break;
                case sfu_pb_1.SignalReply.PayloadCase.TRICKLE:
                    const pbTrickle = reply.getTrickle();
                    if ((pbTrickle === null || pbTrickle === void 0 ? void 0 : pbTrickle.getInit()) !== undefined) {
                        const candidate = JSON.parse(pbTrickle.getInit());
                        const trickle = { target: pbTrickle.getTarget(), candidate };
                        if (this.ontrickle)
                            this.ontrickle(trickle);
                    }
                    break;
                case sfu_pb_1.SignalReply.PayloadCase.ICECONNECTIONSTATE:
                case sfu_pb_1.SignalReply.PayloadCase.ERROR:
                    break;
            }
        });
        // this.streaming.on('end' || 'status', (status?: Status | undefined) => {});
    }
    join(sid, uid, offer) {
        const request = new sfu_pb_1.SignalRequest();
        const join = new sfu_pb_1.JoinRequest();
        join.setSid(sid);
        join.setUid(uid);
        const buffer = Uint8Array.from(JSON.stringify(offer), (c) => c.charCodeAt(0));
        join.setDescription(buffer);
        request.setJoin(join);
        this.streaming.write(request);
        return new Promise((resolve, reject) => {
            const handler = (desc) => {
                resolve({ type: 'answer', sdp: desc.sdp });
                this._event.removeListener('join-reply', handler);
            };
            this._event.addListener('join-reply', handler);
        });
    }
    trickle(trickle) {
        const request = new sfu_pb_1.SignalRequest();
        const pbTrickle = new pb.Trickle();
        pbTrickle.setInit(JSON.stringify(trickle.candidate));
        request.setTrickle(pbTrickle);
        this.streaming.write(request);
    }
    offer(offer) {
        const id = uuid_1.v4();
        const request = new sfu_pb_1.SignalRequest();
        const buffer = Uint8Array.from(JSON.stringify(offer), (c) => c.charCodeAt(0));
        request.setDescription(buffer);
        this.streaming.write(request);
        return new Promise((resolve, reject) => {
            const handler = (desc) => {
                resolve({ type: 'answer', sdp: desc.sdp });
                this._event.removeListener('description', handler);
            };
            this._event.addListener('description', handler);
        });
    }
    answer(answer) {
        const request = new sfu_pb_1.SignalRequest();
        const buffer = Uint8Array.from(JSON.stringify(answer), (c) => c.charCodeAt(0));
        request.setDescription(buffer);
        this.streaming.write(request);
    }
    close() {
        this.streaming.end();
    }
    set onopen(onopen) {
        if (this.streaming !== undefined) {
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
exports.IonSFUGRPCWebSignal = IonSFUGRPCWebSignal;
