export declare type Codec = 'H264' | 'VP8' | 'VP9' | undefined;
export default class PeerConnection extends RTCPeerConnection {
    private codec;
    constructor(config: RTCConfiguration, codec?: Codec);
    close(): void;
    createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
}
