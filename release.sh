## Move JS
cd js
mkdir -p ../_html/js/
cp -f oom.js ../_html/js/

## Compile Zig
# It uses zig builder with ReleaseFast (size isn't a concern).
if ! command -v zig &> /dev/null; then
    curl "https://ziglang.org/builds/zig-linux-x86_64-0.10.0-dev.490+dd7309bde.tar.xz" --output ziglang.tar.xz
    tar -xf ziglang.tar.xz
    export PATH=$(pwd)/zig-linux-x86_64-0.10.0-dev.490+dd7309bd:$PATH
fi

cd ../zig
zig build-exe -target wasm32-freestanding -dynamic -O ReleaseFast main.zig
mkdir -p ../_html/zig/
cp -f index.html ../_html/zig/
cp -f wasm.js ../_html/zig/
mv main.wasm ../_html/zig/


## Compile Go (using CallImport magic assembly instruction)
# It uses gogio and creates the /_html/go folder with index.html, main.wasm and wasm.js. Modify index.html to include new script.
cd ../go
go get gioui.org/cmd/gogio@latest
mkdir -p ../_html/go/
go run gioui.org/cmd/gogio -target js -o ../_html/go .
sed -i 's/<script/<script defer src=\"\/js\/oom.js\"><\/script><script defer/g' ../_html/go/index.html

## Compile Go with syscall/js (slower)
mkdir -p ../_html/go-syscall/
go run gioui.org/cmd/gogio -target js -tags syscall -o ../_html/go-syscall .
sed -i 's/<script/<script defer src=\"\/js\/oom.js\"><\/script><script defer/g' ../_html/go-syscall/index.html

## Compile Go with "cached" syscall/js (somewhat fast)
mkdir -p ../_html/go-syscall-invoke/
go run gioui.org/cmd/gogio -target js -tags syscall_invoke -o ../_html/go-syscall-invoke .
sed -i 's/<script/<script defer src=\"\/js\/oom.js\"><\/script><script defer/g' ../_html/go-syscall-invoke/index.html

# Compile Rust
# It uses cargo and wasm-bindgen to generate the exports/imports:
cd ../rust
mkdir -p ../_html/rust/
cargo install wasm-bindgen-cli
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
wasm-bindgen --no-typescript --target web --out-dir "../_html/rust" ./target/wasm32-unknown-unknown/release/main.wasm
cp -f index.html ../_html/rust/

## Compile CSharp
# It's very slow, so it's the last one. Contains too many files, we move the `_framework` to /_html/csharp.
cd ../csharp
dotnet publish -c Release
mkdir -p ../_html/csharp/
mkdir -p ../_html/csharp/_framework/
mv bin/Release/net6.0/publish/wwwroot/_framework/* ../_html/csharp/_framework/
cp -f index.html ../_html/csharp/

