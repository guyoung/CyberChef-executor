function stringToArrayBuffer(input) {
    const encoder = new TextEncoder()
    const uint8Array = encoder.encode(input)
    return uint8Array.buffer
}

function arrayBufferToString(input) {
    const decoder = new TextDecoder()
    if (isArray(input)) {
        let buffer = new Uint8Array(input).buffer
        return decoder.decode(buffer)
    }
    if (isTypedArray(input)) {
        let buffer = input.buffer
        return decoder.decode(buffer)
    }

    return decoder.decode(input)
}

function isArrayBuffer(val) {
    return val.constructor === ArrayBuffer
}

function isArray(val) {
    return Array.isArray(val)
}

function isTypedArray(val) {
    return val instanceof Int8Array ||
        val instanceof Int16Array ||
        val instanceof Int32Array ||
        val instanceof Uint8Array ||
        val instanceof Uint16Array ||
        val instanceof Uint32Array ||
        val instanceof Float32Array ||
        val instanceof Float64Array ||
        val instanceof BigInt64Array ||
        val instanceof BigUint64Array
}