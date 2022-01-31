//go:build syscall
// +build syscall

package main

import (
	"crypto/rand"
	"encoding/base64"
	"strings"
	"syscall/js"
	"unsafe"
)

func _funcOnClickString(iter int) {
	sb := strings.Builder{}
	sb.Grow(iter)

	js.Global().Call("oomStart")

	for i := 0; i < iter; i++ {
		sb.WriteByte('A')
		js.Global().Call("oomTestString", sb.String())
	}

	js.Global().Call("oomEnd")
}

func _funcOnClickBytes(iter int) {
	js.Global().Call("oomStart")

	for i := 0; i < iter; i++ {
		buf := js.Global().Get("Uint8Array").New(i)
		js.CopyBytesToJS(buf, make([]byte, i))
		js.Global().Call("oomTestBytes", buf)
	}

	js.Global().Call("oomEnd")
}

func _funcOnClickVoid(iter int) {
	js.Global().Call("oomStart")

	for i := 0; i < iter; i++ {
		js.Global().Call("oomTestVoid")
	}

	js.Global().Call("oomEnd")
}

func _funcOnClickMapVoid(iter int) {
	js.Global().Call("oomStart")

	var b = make([]byte, 32*1024)
	var b64 = make([]byte, base64.URLEncoding.EncodedLen(len(b)))

	for i := 0; i < iter; i++ {
		rand.Read(b)
		base64.URLEncoding.Encode(b64, b)
		js.Global().Get("oomTestVoidMap").Call(*(*string)(unsafe.Pointer(&b64)))
	}

	js.Global().Call("oomEnd")
}
