import { Transport } from './client';
interface VideoConstraints {
    [name: string]: {
        resolution: MediaTrackConstraints;
        encodings: RTCRtpEncodingParameters;
    };
}
declare const resolutions: readonly ["qvga", "vga", "shd", "hd", "fhd", "qhd"];
export declare const VideoConstraints: VideoConstraints;
export declare type Layer = 'low' | 'medium' | 'high';
export interface Encoding {
    layer: Layer;
    maxBitrate: number;
    maxFramerate: number;
}
export interface Constraints extends MediaStreamConstraints {
    resolution: typeof resolutions[number];
    codec: string;
    simulcast?: boolean;
    sendEmptyOnMute?: boolean;
    preferredCodecProfile?: string;
}
export declare class LocalStream extends MediaStream {
    static getUserMedia(constraints?: Constraints): Promise<LocalStream>;
    static getDisplayMedia(constraints?: Constraints): Promise<LocalStream>;
    constraints: Constraints;
    pc?: RTCPeerConnection;
    api?: RTCDataChannel;
    constructor(stream: MediaStream, constraints: Constraints);
    private static computeAudioConstraints;
    private static computeVideoConstraints;
    private getTrack;
    private getNewTrack;
    private publishTrack;
    private setPreferredCodec;
    private updateTrack;
    private initAudioEmptyTrack;
    private initVideoEmptyTrack;
    publish(transport: Transport): void;
    unpublish(): void;
    switchDevice(kind: 'audio' | 'video', deviceId: string): Promise<void>;
    mute(kind: 'audio' | 'video'): void;
    unmute(kind: 'audio' | 'video'): Promise<void>;
    enableLayers(layers: Layer[]): Promise<void>;
    updateMediaEncodingParams(encodingParams: RTCRtpEncodingParameters, layer?: Layer): Promise<void>;
}
export interface RemoteStream extends MediaStream {
    api: RTCDataChannel;
    audio: boolean;
    video: 'none' | Layer;
    framerate: Layer;
    _videoPreMute: 'none' | Layer;
    preferLayer(layer: 'none' | Layer): void;
    preferFramerate(layer: Layer): void;
    mute(kind: 'audio' | 'video'): void;
    unmute(kind: 'audio' | 'video'): void;
}
export declare function makeRemote(stream: MediaStream, transport: Transport): RemoteStream;
export {};
