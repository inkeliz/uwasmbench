(() => {
    let _UTF8Decoder = new TextDecoder();

    Object.assign(go.importObject.go, {
        // func oomStart()
        "main.oomStart": (sp) => {
            window.oomStart()
        },
        // func oomEnd()
        "main.oomEnd": (sp) => {
            window.oomEnd()
        },
        // func oomTestString(s string)
        "main.oomTestString": (sp) => {
            const _slicePointer = go.mem.getUint32(sp + 8, true) + go.mem.getInt32(sp + 8 + 4, true) * 4294967296;
            const _sliceLength = go.mem.getUint32(sp + 8 + 8, true) + go.mem.getInt32(sp + 8 + 8 + 4, true) * 4294967296;

            window.oomTestString(
                _UTF8Decoder.decode(new Uint8Array(go._inst.exports.mem.buffer, _slicePointer, _sliceLength)),
            )
        },
        // func oomTestBytes(s string)
        "main.oomTestBytes": (sp) => {
            const _slicePointer = go.mem.getUint32(sp + 8, true) + go.mem.getInt32(sp + 8 + 4, true) * 4294967296;
            const _sliceLength = go.mem.getUint32(sp + 8 + 8, true) + go.mem.getInt32(sp + 8 + 8 + 4, true) * 4294967296;

            window.oomTestBytes(
                new Uint8Array(go._inst.exports.mem.buffer, _slicePointer, _sliceLength),
            )
        },
        // func oomTestVoid()
        "main.oomTestVoid": (sp) => {
            window.oomTestVoid()
        },
        "main.oomTestVoidMap": (sp) => {
            const _slicePointer = go.mem.getUint32(sp + 8, true) + go.mem.getInt32(sp + 8 + 4, true) * 4294967296;
            const _sliceLength = go.mem.getUint32(sp + 8 + 8, true) + go.mem.getInt32(sp + 8 + 8 + 4, true) * 4294967296;

            window.oomTestVoidMap[
                _UTF8Decoder.decode(new Uint8Array(go._inst.exports.mem.buffer, _slicePointer, _sliceLength))
            ]();
        },
    });
})();