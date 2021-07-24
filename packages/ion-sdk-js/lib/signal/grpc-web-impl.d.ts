import { Signal } from '.';
import { SFUClient, BidirectionalStream } from './_proto/library/sfu/sfu_pb_service';
import { SignalRequest, SignalReply } from './_proto/library/sfu/sfu_pb';
import { Trickle } from '../client';
declare class IonSFUGRPCWebSignal implements Signal {
    protected client: SFUClient;
    protected streaming: BidirectionalStream<SignalRequest, SignalReply>;
    private _event;
    private _onopen?;
    private _onclose?;
    private _onerror?;
    onnegotiate?: (jsep: RTCSessionDescriptionInit) => void;
    ontrickle?: (trickle: Trickle) => void;
    constructor(uri: string);
    join(sid: string, uid: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
    trickle(trickle: Trickle): void;
    offer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit>;
    answer(answer: RTCSessionDescriptionInit): void;
    close(): void;
    set onopen(onopen: () => void);
    set onerror(onerror: (error: Event) => void);
    set onclose(onclose: (ev: Event) => void);
}
export { IonSFUGRPCWebSignal };
