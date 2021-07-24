import Client, { Configuration } from './client';
import { LocalStream, RemoteStream, Constraints } from './stream';
import { Signal, Trickle } from './signal';
export { Client, LocalStream, RemoteStream, Constraints, Signal, Trickle };
export interface JoinResult {
    success: boolean;
    reason: string;
}
export declare enum PeerState {
    NONE = 0,
    JOIN = 1,
    UPDATE = 2,
    LEAVE = 3
}
export interface Peer {
    uid: string;
    sid: string;
    info: Record<string, any>;
}
export interface PeerEvent {
    state: PeerState;
    peer: Peer;
}
export declare enum StreamState {
    NONE = 0,
    ADD = 1,
    REMOVE = 2
}
export interface StreamEvent {
    uid: string;
    state: StreamState;
    streams: Stream[];
}
export interface Track {
    id: string;
    label: string;
    kind: string;
    simulcast: Map<string, string>;
}
export interface Stream {
    id: string;
    tracks: Track[];
}
export interface Message {
    from: string;
    to: string;
    data: Record<string, any>;
}
export declare class IonConnector {
    private _biz;
    private _sfu;
    private _sid;
    private _uid;
    onerror?: (err: Error) => void;
    onjoin?: (success: boolean, reason: string) => void;
    onleave?: (reason: string) => void;
    onpeerevent?: (ev: PeerEvent) => void;
    onstreamevent?: (ev: StreamEvent) => void;
    onmessage?: (msg: Message) => void;
    ontrack?: (track: MediaStreamTrack, stream: RemoteStream) => void;
    ondatachannel?: (ev: RTCDataChannelEvent) => void;
    onspeaker?: (ev: string[]) => void;
    constructor(url: string, config?: Configuration);
    get sfu(): Client | undefined;
    join(sid: string, uid: string, info: Record<string, any>, token: string | undefined): Promise<JoinResult>;
    leave(uid: string): Promise<string>;
    message(from: string, to: string, data: Record<string, any>): Promise<void>;
    close(): void;
}
