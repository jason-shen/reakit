import { Signal } from './signal';
import { LocalStream, RemoteStream } from './stream';
export interface Sender {
    stream: MediaStream;
    transceivers: {
        [kind in 'video' | 'audio']: RTCRtpTransceiver;
    };
}
export interface Configuration extends RTCConfiguration {
    codec: 'vp8' | 'vp9' | 'h264';
}
export interface Trickle {
    candidate: RTCIceCandidateInit;
    target: Role;
}
export interface ActiveLayer {
    streamId: string;
    activeLayer: string;
    availableLayers: string[];
}
declare enum Role {
    pub = 0,
    sub = 1
}
declare type Transports<T extends string | symbol | number, U> = {
    [K in T]: U;
};
export declare class Transport {
    api?: RTCDataChannel;
    signal: Signal;
    pc: RTCPeerConnection;
    candidates: RTCIceCandidateInit[];
    constructor(role: Role, signal: Signal, config: RTCConfiguration);
}
export default class Client {
    transports?: Transports<Role, Transport>;
    private config;
    private signal;
    ontrack?: (track: MediaStreamTrack, stream: RemoteStream) => void;
    ondatachannel?: (ev: RTCDataChannelEvent) => void;
    onspeaker?: (ev: string[]) => void;
    onerrnegotiate?: (role: Role, err: Error, offer?: RTCSessionDescriptionInit, answer?: RTCSessionDescriptionInit) => void;
    onactivelayer?: (al: ActiveLayer) => void;
    constructor(signal: Signal, config?: Configuration);
    join(sid: string, uid: string): Promise<void>;
    leave(): void;
    getPubStats(selector?: MediaStreamTrack): Promise<RTCStatsReport>;
    getSubStats(selector?: MediaStreamTrack): Promise<RTCStatsReport>;
    publish(stream: LocalStream): void;
    createDataChannel(label: string): RTCDataChannel;
    close(): void;
    private trickle;
    private negotiate;
    private onNegotiationNeeded;
    private processChannelMessage;
}
export {};
