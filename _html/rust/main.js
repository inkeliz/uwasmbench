
let wasm;

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @param {number} i
*/
export function func_on_change(i) {
    wasm.func_on_change(i);
}

/**
* @param {number} i
*/
export function func_on_select(i) {
    wasm.func_on_select(i);
}

/**
*/
export function func_on_click() {
    wasm.func_on_click();
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('main_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_oomStart_5c22ccbe6dea18c0 = typeof oomStart == 'function' ? oomStart : notDefined('oomStart');
    imports.wbg.__wbg_oomTestString_69af14b08ee46e22 = function(arg0, arg1) {
        oomTestString(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_oomEnd_73ac8aad18d29a6a = typeof oomEnd == 'function' ? oomEnd : notDefined('oomEnd');
    imports.wbg.__wbg_oomTestBytes_ad517bb5907d9fd2 = function(arg0, arg1) {
        var v0 = getArrayU8FromWasm0(arg0, arg1).slice();
        wasm.__wbindgen_free(arg0, arg1 * 1);
        oomTestBytes(v0);
    };
    imports.wbg.__wbg_oomTestVoid_a93f4a24f90e5803 = typeof oomTestVoid == 'function' ? oomTestVoid : notDefined('oomTestVoid');

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}

export default init;

