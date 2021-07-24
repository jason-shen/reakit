"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdp_transform_1 = require("sdp-transform");
var PayloadType;
(function (PayloadType) {
    PayloadType[PayloadType["Opus"] = 111] = "Opus";
    PayloadType[PayloadType["VP8"] = 96] = "VP8";
    PayloadType[PayloadType["VP9"] = 98] = "VP9";
    PayloadType[PayloadType["H264"] = 102] = "H264";
})(PayloadType || (PayloadType = {}));
class PeerConnection extends RTCPeerConnection {
    constructor(config, codec) {
        super(config);
        this.codec = codec;
    }
    close() {
        super.getSenders().forEach((sender) => super.removeTrack(sender));
        super.close();
    }
    createOffer(options) {
        const _super = Object.create(null, {
            createOffer: { get: () => super.createOffer }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const offer = yield _super.createOffer.call(this, options);
            if (!this.codec)
                return offer;
            // munge sdp to update codec preference order
            const session = sdp_transform_1.parse(offer.sdp);
            session.media.forEach((media, i) => {
                const j = media.rtp.findIndex((rtp) => rtp.codec === this.codec);
                const prev = media.rtp[0];
                session.media[i].rtp[0] = session.media[i].rtp[j];
                session.media[i].rtp[j] = prev;
            });
            offer.sdp = sdp_transform_1.write(session);
            return offer;
        });
    }
}
exports.default = PeerConnection;
