const std = @import("std");

extern "oom" fn oomStart() void;
extern "oom" fn oomEnd() void;
extern "oom" fn oomTestString(strPtr: usize, strLen: usize) void;
extern "oom" fn oomTestBytes(strPtr: usize, strLen: usize) void;
extern "oom" fn oomTestVoid() void;

const TestMode = enum { String, Bytes, Void };

var Mutex: std.Thread.Mutex = .{};
var Iterations: usize = 10000;
var Mode:TestMode = TestMode.String;

pub fn main() !void {}

export fn FuncOnSelect(i: usize) bool {
    Mutex.lock();
    defer Mutex.unlock();
    Mode = @intToEnum(TestMode, i);
    return true;
}

export fn FuncOnChange(i: usize) bool {
    Mutex.lock();
    defer Mutex.unlock();
    if (i < 0) {
        return false;
    }
    Iterations = i;
    return true;
}

export fn FuncOnClick() bool {
    Mutex.lock();
    var iter:usize = Iterations;
    var mode:TestMode = Mode;
    Mutex.unlock();

    return switch (mode) {
    TestMode.String => _FuncOnClickString(iter),
    TestMode.Bytes => _FuncOnClickBytes(iter),
    TestMode.Void => _FuncOnClickVoid(iter),
    };
}

fn _FuncOnClickString(iter:usize) bool {
    const sb: []u8 = std.heap.page_allocator.alloc(u8, iter) catch return false;
    defer std.heap.page_allocator.free(sb);

    oomStart();

    var i: usize = 0;
    while (i < iter) : (i += 1) {
        sb[i] = 'A';
        oomTestString(@ptrToInt(sb.ptr), i+1);
    }

    oomEnd();

    return true;
}

fn _FuncOnClickBytes(iter:usize) bool {
    oomStart();

    var i: usize = 0;
    while (i < iter) : (i += 1) {
        const bb: []u8 = std.heap.page_allocator.alloc(u8, i) catch return false;
        for (bb[0..i]) |*b| {
            b.* = 0;
        }

        oomTestBytes(@ptrToInt(bb.ptr), i);
        std.heap.page_allocator.free(bb);
    }

    oomEnd();

    return true;
}

fn _FuncOnClickVoid(iter:usize) bool {
    oomStart();

    var i: usize = 0;
    while (i < iter) : (i += 1) {
        oomTestVoid();
    }

    oomEnd();

    return true;
}

export fn run() bool {
    return true;
}
