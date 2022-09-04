use std::fs::OpenOptions;

use crate::point::point::Point;

pub trait Writter {
    fn store(&self, filename: String);
}
