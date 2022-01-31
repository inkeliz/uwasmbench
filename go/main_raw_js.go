//go:build !syscall && !syscall_invoke
// +build !syscall,!syscall_invoke

package main

import (
	"crypto/rand"
	"encoding/base64"
	"strings"
	"unsafe"
)

func _funcOnClickString(iter int) {
	sb := strings.Builder{}
	sb.Grow(iter)

	oomStart()

	for i := 0; i < iter; i++ {
		sb.WriteByte('A')
		oomTestString(sb.String())
	}

	oomEnd()
}

func _funcOnClickBytes(iter int) {
	oomStart()

	for i := 0; i < iter; i++ {
		oomTestBytes(make([]byte, i))
	}

	oomEnd()
}

func _funcOnClickVoid(iter int) {
	oomStart()

	for i := 0; i < iter; i++ {
		oomTestVoid()
	}

	oomEnd()
}

func _funcOnClickMapVoid(iter int) {
	oomStart()

	var b = make([]byte, 32*1024)
	var b64 = make([]byte, base64.URLEncoding.EncodedLen(len(b)))

	for i := 0; i < iter; i++ {
		rand.Read(b)
		base64.URLEncoding.Encode(b64, b)
		oomTestVoidMap(*(*string)(unsafe.Pointer(&b64)))
	}

	oomEnd()
}
