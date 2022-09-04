use std::fs::OpenOptions;

use serde::{Deserialize, Serialize};

use crate::writter::writter::Writter;
use std::io::Write;

#[derive(Deserialize, Serialize)]
pub struct Point {
    pub x: i32,
    pub y: i32,
}

impl Writter for Point {
    fn store(&self, filename: String) {
        let mut f = OpenOptions::new()
            .append(true)
            .create(true)
            .open(filename)
            .expect("Unable to open file");
        f.write_all(serde_json::to_string(&self).unwrap().as_bytes())
            .expect("Unable to write point");
        f.write("\n".as_bytes()).expect("WTF");
    }
}

impl Point {
    pub fn new(x: i32, y: i32) -> Point {
        Point { x, y }
    }
}
