#[macro_use]
extern crate lazy_static;

use wasm_bindgen::prelude::*;
use std::sync::RwLock;

enum TestMode { String, Bytes, Void }

lazy_static! {
    static ref ITERATIONS: RwLock<usize> = RwLock::new(10_000);
    static ref MODE: RwLock<TestMode> = RwLock::new(TestMode::String);
}

#[wasm_bindgen]
extern "C" {
    fn oomStart();
    fn oomEnd();
    fn oomTestString(s: &str);
    fn oomTestBytes(s: Vec<u8>);
    fn oomTestVoid();
}

#[wasm_bindgen]
pub fn func_on_change(i: usize) {
    if i <= 0 {
        return
    }
    *ITERATIONS.write().unwrap() = i
}

#[wasm_bindgen]
pub fn func_on_select(i: usize) {
    *MODE.write().unwrap() = unsafe { ::std::mem::transmute((i & 0xFF) as i8) };
}

#[wasm_bindgen]
pub fn func_on_click() {
    let iter: usize = *ITERATIONS.read().unwrap();
    let mode:&TestMode = &*MODE.read().unwrap();

    match mode {
    TestMode::String => func_on_click_string(iter),
    TestMode::Bytes => func_on_click_bytes(iter),
    TestMode::Void => func_on_click_void(iter),
    }

}

fn func_on_click_string(iter:usize) {
    let mut sb = String::with_capacity(iter);

    oomStart();

    let mut i: usize = 0;
    while i < iter {
        sb.push('A');
        oomTestString(sb.as_str());
        i = i + 1;
    }

    oomEnd();
}

fn func_on_click_bytes(iter:usize) {
    oomStart();

    let mut i: usize = 0;
    while i < iter {
        oomTestBytes(vec![0; i]);
        i = i + 1;
    }

    oomEnd();
}

fn func_on_click_void(iter:usize) {
    oomStart();

    let mut i: usize = 0;
    while i < iter {
        oomTestVoid();
        i = i + 1;
    }

    oomEnd();
}

fn main() {}