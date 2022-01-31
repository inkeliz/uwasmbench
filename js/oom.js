let len = 0;
let calls = 0;
let start = 0;
let debugImpl = false;

_create = function (name, id, tag, value, type) {
    let div = window.document.createElement("div")
    let span = window.document.createElement("span")
    span.innerText = name + ": "
    let output = window.document.createElement(tag)
    output.id = id
    if (value !== undefined) {
        output.value = value
    }
    if (type !== undefined) {
        output.type = type
    }
    div.appendChild(span)
    div.appendChild(output)
    window.document.querySelector("body").appendChild(div)
}

_create("Time", "time", "output")
_create("Byte", "byte", "output")
_create("Runs", "runs", "output")
_create("Lang", "os", "output", document.title + "(" + document.location.pathname + ")")
_create("DebugImplementation", "debug", "output", debugImpl)
_create("DebugImplementation", "debugCheckbox", "input", debugImpl, "checkbox")

document.querySelector("#debugCheckbox").addEventListener("change", function (e){
    debugImpl = e.currentTarget.checked;
}, {"passive": true})

window.oomStart = function () {
    start = Date.now();
}
window.oomTestString = function (k) {
    calls += 1;
    len += k.length;
    if (debugImpl) {
        if (k !== "A".repeat(k.length)) {
            alert("error: invalid data provided")
        }
    }
}
window.oomTestBytes = function (k) {
    calls += 1;
    len += k.length;
    if (debugImpl) {
        if (!k.every(function (v, _, _) {
            return v === 0
        })) {
            alert("not empty array")
        }
    }
}
window.oomTestVoid = function () {
    calls += 1;
}
window.oomTestVoidMap = new Proxy([], {
    get: function (_, k, _) {
        len += k.length;
        calls += 1;
        return function () {/* no-op */
        };
    },
    has: function (_, _) {
        return true;
    }
})
window.oomEnd = function () {
    document.querySelector("#time").value = (Date.now() - start) + "ms"
    document.querySelector("#byte").value = len + "bytes"
    document.querySelector("#runs").value = calls + "calls"
    document.querySelector("#debug").value = debugImpl
    len = calls = start = 0;
}