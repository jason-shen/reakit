"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uint8ArrayToJSONString = void 0;
function Uint8ArrayToJSONString(dataArray) {
    let dataString = '';
    if (dataArray.length >= 2) {
        for (const element of dataArray) {
            dataString += String.fromCharCode(element);
        }
    }
    else {
        dataString = '{}';
    }
    return dataString;
}
exports.Uint8ArrayToJSONString = Uint8ArrayToJSONString;
