import { Signal } from './';
import { Trickle } from '../client';
export default class IonSFUJSONRPCSignal implements Signal {
    protected socket: WebSocket;
    private _onopen?;
    private _onclose?;
    private _onerror?;
    onnegotiate?: (jsep: RTCSessionDescriptionInit) => void;
    ontrickle?: (trickle: Trickle) => void;
    constructor(uri: string);
    join(sid: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
    trickle(trickle: Trickle): void;
    offer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
    answer(answer: RTCSessionDescriptionInit): void;
    close(): void;
    set onopen(onopen: () => void);
    set onerror(onerror: (error: Event) => void);
    set onclose(onclose: (ev: Event) => void);
}
