package main

import (
	"strconv"
	"sync"
	"syscall/js"
)

var (
	Mutex      sync.Mutex
	Iterations uint64   = 10_000
	Mode       TestMode = String
)

type TestMode int

const (
	String = iota
	Bytes
	Void
	Map
)

func main() {
	doc := js.Global().Get("document")

	button := doc.Call("createElement", "button")
	button.Set("innerText", "Run")

	runs := doc.Call("createElement", "input")
	runs.Set("type", "numeric")
	runs.Set("min", "1")
	runs.Set("value", Iterations)

	selects := doc.Call("createElement", "select")
	selects.Set("type", "numeric")
	selects.Set("min", "1")
	selects.Set("value", Iterations)

	for v, o := range []string{"String", "Bytes", "Void", "VoidMap"} {
		option := doc.Call("createElement", "option")
		option.Set("value", v)
		option.Set("innerText", o)
		selects.Call("appendChild", option)
	}

	body := doc.Call("querySelector", "body")
	body.Call("prepend", button)
	body.Call("prepend", runs)
	body.Call("prepend", selects)
	body.Get("style").Set("margin", "8px")

	options := map[string]interface{}{"passive": true}

	selects.Call("addEventListener", "change", js.FuncOf(FuncOnSelect), options)
	runs.Call("addEventListener", "change", js.FuncOf(FuncOnChange), options)
	button.Call("addEventListener", "click", js.FuncOf(FuncOnClick), options)

	select {} // Prevent main from exit. ;)
}

func FuncOnSelect(this js.Value, _ []js.Value) interface{} {
	Mutex.Lock()
	defer Mutex.Unlock()
	iter, err := strconv.ParseUint(this.Get("value").String(), 10, 64)
	if err != nil {
		return nil
	}
	Mode = TestMode(iter)
	return nil
}

func FuncOnChange(this js.Value, _ []js.Value) interface{} {
	Mutex.Lock()
	defer Mutex.Unlock()
	iter, _ := strconv.ParseUint(this.Get("value").String(), 10, 64)
	if iter <= 0 {
		return nil
	}
	Iterations = iter
	return nil
}

func FuncOnClick(_ js.Value, _ []js.Value) interface{} {
	Mutex.Lock()
	iter := int(Iterations)
	Mutex.Unlock()

	// funcOnClick varies accordingly with the build-tags.
	// If -tags "syscall" is provided it uses the js/syscall, which is slower.
	// If no custom build-tags is provided it uses the CallImport assembly instruction and
	// custom imported-function.
	switch Mode {
	case String:
		go _funcOnClickString(iter)
	case Bytes:
		go _funcOnClickBytes(iter)
	case Void:
		go _funcOnClickVoid(iter)
	case Map:
		go _funcOnClickMapVoid(iter)
	}

	return nil
}

// Functions declared as imports, see main_raw_js.js.
func oomStart()
func oomTestString(s string)
func oomTestBytes(b []byte)
func oomTestVoid()
func oomTestVoidMap(s string)
func oomEnd()
