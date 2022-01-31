const _UTF8Decoder = new TextDecoder();

let zig = {
    exports: undefined,
    importObject: {
        oom: {
            oomStart: function () {
                window.oomStart()
            },
            oomTestString: function (strPtr, strLen) {
                window.oomTestString(
                    _UTF8Decoder.decode(new Uint8Array(zig.exports.memory.buffer, strPtr, strLen)),
                )
            },
            oomTestBytes: function (strPtr, strLen) {
                window.oomTestBytes(
                    new Uint8Array(zig.exports.memory.buffer, strPtr, strLen),
                )
            },
            oomTestVoid: function () {
                window.oomTestVoid()
            },
            oomEnd: function () {
                window.oomEnd()
            }
        }
    },
    run: function (result) {
        zig.exports = result.instance.exports;
        if (!zig.exports.run()) {
            alert("error on initialization")
            throw "Launch Error";
        }

        document.querySelector("select").addEventListener("change", function (e){
            zig.exports.FuncOnSelect(parseInt(e.currentTarget.value));
        }, {"passive": true})
        document.querySelector("input").addEventListener("change", function (e){
            zig.exports.FuncOnChange(parseInt(e.currentTarget.value));
        }, {"passive": true})
        document.querySelector("button").addEventListener("click", function (e){
            zig.exports.FuncOnClick();
        }, {"passive": true})
    }
}

WebAssembly.instantiateStreaming(fetch("main.wasm"), zig.importObject).then((result) => {
    zig.run(result);
});