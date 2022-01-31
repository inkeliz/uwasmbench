# INKWASMBench

**[RUN IT ONLINE](https://uwasmbench.pages.dev/)**

That is a small benchmark to check how efficient each language can call JS functions, from their host language.

> The set of tests was designed to see the performance overhead,
> and not the performance of the given language on WASM.

---------

### Languages (and implementations):

- Golang:
    - `/go`: Uses `CallImport` magic instruction and uses `main_raw_js.js` as binding to `oom.js`.
    - `/go-syscall`: Uses `syscall/js`  package to call `oom.js` without any optimization.
    - `/go-syscall-invoke`: Uses `syscall/js` package to call `oom.js` with some optimization (using `.Invoke` instead
      of new `.Call`).
- Zig:
    - `/zig`: Uses `extern fn` to call imports and uses `wasm.js` as binding to `oom.js`.
- Rust:
    - `/rust`: Uses `extern` to call imports and `wasm_bindgen` to create the bindings to `oom.js`.
- C#:
    - `/csharp`: Uses `JsRuntime` to call `oom.js` package without any optimization.

### Tests:

#### `TestString`:

The host-language must send one string containing all characters as "A". Each iteration of the loop must increase the
size of the string by one. The JS must receive it as `String`, using `TextDecoder` or equivalent, facing the performance
penalty.

#### `TestBytes`:

The host-language must create and send one disposable byte-array containing all bytes as 0x00. The size of the
byte-array must be the index of the current iteration. The JS must receive it as `Uint8Array`.

#### `TestVoid`:

The host-language must call it, without provide any argument.

### Results:

#### MacOS 15.1 @ Safari 15 @ MacBook Air 2020 (Apple M1):

|                | TestString-20000 | TestBytes-20000 | TestVoid-20000 |
|----------------|------------------|-----------------|----------------|
| Zig            | ~39ms            | ~71ms           | ~1ms           |
| Rust           | ~40ms            | ~73ms           | ~1ms           |
| Golang         | ~42ms            | ~124ms          | ~1ms           |
| Golang-Invoke  | ~311ms           | ~227ms          | ~9ms           |
| Golang-Syscall | ~335ms           | ~321ms          | ~21ms          |
| C#             | ~2449ms          | ~815ms          | ~510ms         |

#### Windows 10 @ Edge 97 @ Desktop (AMD Ryzen 3900X):

|                | TestString-20000 | TestBytes-20000 | TestVoid-20000 |
|----------------|------------------|-----------------|----------------|
| Zig            | ~253ms           | ~51ms           | ~0ms           |
| Rust           | ~247ms           | ~121ms          | ~0ms           |
| Golang         | ~252ms           | ~86ms           | ~0ms           |
| Golang-Invoke  | ~217ms           | ~324ms          | ~4ms           |
| Golang-Syscall | ~251ms           | ~509ms          | ~22ms          |
| C#             | ~3136ms          | ~1684ms         | ~810ms         |

#### Android 10 @ Chrome 97 @ Xiaomi Note 9 (MediaTek Helio G85):

|                | TestString-10000 | TestBytes-10000 | TestVoid-10000 |
|----------------|------------------|-----------------|----------------|
| Zig            | ~223ms           | ~56ms           | ~0ms           |
| Rust           | ~212ms           | ~135ms          | ~0ms           |
| Golang         | ~230ms           | ~198ms          | ~1ms           |
| Golang-Invoke  | ~338ms           | ~625ms          | ~6ms           |
| Golang-Syscall | ~397ms           | ~984ms          | ~84ms          |
| C#             | _CRASH_          | _CRASH_         | _CRASH_        |

### Build:

See `/release.sh` file to see how the `/_html` was created and how it compiles each language.

### Run:

You can try it online. If you want to run it locally, you must start a server (webassembly can't be loaded
over `file://`):

- Javacript:
  ```
  npx serve _html
  ```

- Golang:
  ```
  go run .
  ```