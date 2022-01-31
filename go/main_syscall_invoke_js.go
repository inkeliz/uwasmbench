//go:build syscall_invoke
// +build syscall_invoke

package main

import (
	"crypto/rand"
	"encoding/base64"
	"strings"
	"syscall/js"
	"unsafe"
)

var (
	uint8ArrayJS = js.Global().Get("Uint8Array")

	oomStartJS       = js.Global().Get("oomStart")
	oomTestStringJS  = js.Global().Get("oomTestString")
	oomTestBytesJS   = js.Global().Get("oomTestBytes")
	oomTestVoidJS    = js.Global().Get("oomTestVoid")
	oomTestVoidMapJS = js.Global().Get("oomTestVoidMap")
	oomEndJS         = js.Global().Get("oomEnd")
)

func _funcOnClickString(iter int) {
	sb := strings.Builder{}
	sb.Grow(iter)

	oomStartJS.Invoke()
	for i := 0; i < iter; i++ {
		sb.WriteByte('A')
		oomTestStringJS.Invoke(sb.String())
	}
	oomEndJS.Invoke()
}

func _funcOnClickBytes(iter int) {
	oomStartJS.Invoke()

	for i := 0; i < iter; i++ {
		buf := uint8ArrayJS.New(i)
		js.CopyBytesToJS(buf, make([]byte, i))
		oomTestBytesJS.Invoke(buf)
	}

	oomEndJS.Invoke()
}

func _funcOnClickVoid(iter int) {
	oomStartJS.Invoke()

	for i := 0; i < iter; i++ {
		oomTestVoidJS.Invoke()
	}

	oomEndJS.Invoke()
}

func _funcOnClickMapVoid(iter int) {
	oomStartJS.Invoke()

	var b = make([]byte, 32*1024)
	var b64 = make([]byte, base64.URLEncoding.EncodedLen(len(b)))

	for i := 0; i < iter; i++ {
		rand.Read(b)
		base64.URLEncoding.Encode(b64, b)
		oomTestVoidMapJS.Call(*(*string)(unsafe.Pointer(&b64)))
	}

	oomEndJS.Invoke()
}
