"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BizClient = void 0;
const grpc_web_1 = require("@improbable-eng/grpc-web");
const events_1 = require("events");
const biz = require("./_proto/library/biz/biz_pb");
const ion = require("./_proto/library/biz/ion_pb");
const biz_rpc = require("./_proto/library/biz/biz_pb_service");
const ion_1 = require("../ion");
const utils_1 = require("./utils");
class BizClient extends events_1.EventEmitter {
    constructor(uri) {
        super();
        this.client = new biz_rpc.BizClient(uri, {
            transport: grpc_web_1.grpc.WebsocketTransport(),
        });
        this.streaming = this.client.signal();
        this.streaming.on('data', (reply) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            switch (reply.getPayloadCase()) {
                case biz.SignalReply.PayloadCase.JOINREPLY:
                    const result = {
                        success: ((_a = reply.getJoinreply()) === null || _a === void 0 ? void 0 : _a.getSuccess()) || false,
                        reason: ((_b = reply.getJoinreply()) === null || _b === void 0 ? void 0 : _b.getReason()) || 'unkown reason',
                    };
                    this.emit('join-reply', result.success, result.reason);
                    break;
                case biz.SignalReply.PayloadCase.LEAVEREPLY:
                    const reason = ((_c = reply.getLeavereply()) === null || _c === void 0 ? void 0 : _c.getReason()) || 'unkown reason';
                    this.emit('leave-reply', reason);
                    break;
                case biz.SignalReply.PayloadCase.PEEREVENT:
                    {
                        const evt = reply.getPeerevent();
                        let state = ion_1.PeerState.NONE;
                        const info = JSON.parse(utils_1.Uint8ArrayToJSONString((_d = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _d === void 0 ? void 0 : _d.getInfo()));
                        switch (evt === null || evt === void 0 ? void 0 : evt.getState()) {
                            case ion.PeerEvent.State.JOIN:
                                state = ion_1.PeerState.JOIN;
                                break;
                            case ion.PeerEvent.State.UPDATE:
                                state = ion_1.PeerState.UPDATE;
                                break;
                            case ion.PeerEvent.State.LEAVE:
                                state = ion_1.PeerState.LEAVE;
                                break;
                        }
                        const peer = {
                            uid: ((_e = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _e === void 0 ? void 0 : _e.getUid()) || '',
                            sid: ((_f = evt === null || evt === void 0 ? void 0 : evt.getPeer()) === null || _f === void 0 ? void 0 : _f.getSid()) || '',
                            info: info || {},
                        };
                        this.emit('peer-event', { state, peer });
                    }
                    break;
                case biz.SignalReply.PayloadCase.STREAMEVENT:
                    {
                        const evt = reply.getStreamevent();
                        let state = ion_1.StreamState.NONE;
                        switch (evt === null || evt === void 0 ? void 0 : evt.getState()) {
                            case ion.StreamEvent.State.ADD:
                                state = ion_1.StreamState.ADD;
                                break;
                            case ion.StreamEvent.State.REMOVE:
                                state = ion_1.StreamState.REMOVE;
                                break;
                        }
                        const sid = (evt === null || evt === void 0 ? void 0 : evt.getSid()) || '';
                        const uid = (evt === null || evt === void 0 ? void 0 : evt.getUid()) || '';
                        const streams = Array();
                        evt === null || evt === void 0 ? void 0 : evt.getStreamsList().forEach((ionStream) => {
                            const tracks = Array();
                            ionStream.getTracksList().forEach((ionTrack) => {
                                const track = {
                                    id: ionTrack.getId(),
                                    label: ionTrack.getLabel(),
                                    kind: ionTrack.getKind(),
                                    simulcast: ionTrack.getSimulcastMap(),
                                };
                                tracks.push(track);
                            });
                            const stream = {
                                id: ionStream.getId(),
                                tracks: tracks || [],
                            };
                            streams.push(stream);
                        });
                        this.emit('stream-event', { state, sid, uid, streams });
                    }
                    break;
                case biz.SignalReply.PayloadCase.MSG:
                    const data = JSON.parse(utils_1.Uint8ArrayToJSONString((_g = reply.getMsg()) === null || _g === void 0 ? void 0 : _g.getData()));
                    const msg = { from: ((_h = reply.getMsg()) === null || _h === void 0 ? void 0 : _h.getFrom()) || '', to: ((_j = reply.getMsg()) === null || _j === void 0 ? void 0 : _j.getTo()) || '', data: data || {} };
                    this.emit('message', msg);
                    break;
            }
        });
    }
    async join(sid, uid, info, token) {
        const request = new biz.SignalRequest();
        const join = new biz.Join();
        join.setToken(token || '');
        const peer = new ion.Peer();
        peer.setSid(sid);
        peer.setUid(uid);
        const buffer = Uint8Array.from(JSON.stringify(info), (c) => c.charCodeAt(0));
        peer.setInfo(buffer);
        join.setPeer(peer);
        request.setJoin(join);
        this.streaming.write(request);
        return new Promise((resolve, reject) => {
            const handler = (result) => {
                resolve(result);
                this.removeListener('join-reply', handler);
            };
            this.addListener('join-reply', handler);
        });
    }
    async leave(uid) {
        const request = new biz.SignalRequest();
        const leave = new biz.Leave();
        leave.setUid(uid);
        request.setLeave(leave);
        this.streaming.write(request);
        return new Promise((resolve, reject) => {
            const handler = (reason) => {
                resolve(reason);
                this.removeListener('join-reply', handler);
            };
            this.addListener('join-reply', handler);
        });
    }
    async sendMessage(from, to, data) {
        const request = new biz.SignalRequest();
        const message = new ion.Message();
        message.setFrom(from);
        message.setTo(to);
        const buffer = Uint8Array.from(JSON.stringify(data), (c) => c.charCodeAt(0));
        message.setData(buffer);
        request.setMsg(message);
        this.streaming.write(request);
    }
    close() {
        this.streaming.end();
    }
}
exports.BizClient = BizClient;
