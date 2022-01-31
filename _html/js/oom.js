_create = function (name, id, tag, value) {
    let div = window.document.createElement("div")
    let span = window.document.createElement("span")
    span.innerText = name + ": "
    let output = window.document.createElement(tag)
    output.id = id
    if (value !== undefined) {
        output.value = value
    }
    div.appendChild(span)
    div.appendChild(output)
    window.document.querySelector("body").appendChild(div)
}

_create("Time", "time", "output")
_create("Byte", "byte", "output")
_create("Runs", "runs", "output")
_create("Lang", "os", "output", document.title + "(" + document.location.pathname + ")")

let len = 0;
let calls = 0;
let start = 0;

window.oomStart = function () {
    start = Date.now();
}
window.oomTestString = function (k) {
    calls += 1;
    len += k.length;
    /*
    if (k !== "A".repeat(k.length)) {
        alert("error: invalid data provided")
    }
    */
}
window.oomTestBytes = function (k) {
    calls += 1;
    len += k.length;
    let x = new Uint8Array(10);
    /*
    if (!k.every(function(v, _, _) { return v === 0})) {
        alert("not empty array")
    }
    */
}
window.oomTestVoid = function () {
    calls += 1;
}
window.oomTestVoidMap = new Proxy([], {
    get: function(_, k, _) {
        len += k.length;
        calls += 1;
        return function() {/* no-op */};
    },
    has: function(_, _) {
        return true;
    }
})
window.oomEnd = function () {
    document.querySelector("#time").value = (Date.now() - start) + "ms"
    document.querySelector("#byte").value = len + "bytes"
    document.querySelector("#runs").value = calls + "calls"
    len = calls = start = 0;
}