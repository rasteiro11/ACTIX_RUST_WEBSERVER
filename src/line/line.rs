use std::fs::OpenOptions;

use serde::{Deserialize, Serialize};

use crate::{
    point::point::{Point, Point2D},
    writter::writter::Writter,
};
use std::io::Write;

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Line {
    pub p1: Point2D,
    pub p2: Point2D,
    pub color: String,
}

impl Writter for Line {
    fn store(&self, filename: &String) {
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

//impl Line {
//    pub fn new(p1: Point, p2: Point) -> Line {
//        Line {
//            p1,
//            p2,
//            color: String::new(),
//            t: String::new(),
//        }
//    }
//}
