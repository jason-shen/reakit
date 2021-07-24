import { Signal } from '.';
import { Trickle } from '../client';
declare class IonSFUJSONRPCSignal implements Signal {
    protected socket: WebSocket;
    private _onopen?;
    private _onclose?;
    private _onerror?;
    onnegotiate?: (jsep: RTCSessionDescriptionInit) => void;
    ontrickle?: (trickle: Trickle) => void;
    private _notifyhandlers;
    constructor(uri: string);
    on_notify<T>(method: string, cb: (params: T) => void): void;
    call<T>(method: string, params: any): Promise<T>;
    notify(method: string, params: any): void;
    join(sid: string, uid: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
    trickle(trickle: Trickle): void;
    offer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
    answer(answer: RTCSessionDescriptionInit): void;
    close(): void;
    set onopen(onopen: () => void);
    set onerror(onerror: (error: Event) => void);
    set onclose(onclose: (ev: Event) => void);
}
export { IonSFUJSONRPCSignal };
