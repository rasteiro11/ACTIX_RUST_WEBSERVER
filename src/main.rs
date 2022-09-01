use std::{default, fmt::Debug, thread, time::Duration};

use actix_web::{get, middleware::Logger, post, web, App, HttpResponse, HttpServer, Responder};
use env_logger::Env;
use log::info;
use serde::{Deserialize, Serialize};

//#[get("/point")]
//async fn get_simple_point() -> impl Responder {
//    HttpResponse::Ok()
//        .content_type("application/json")
//        .body("{ type: P, X: 50, Y: 50 }")
//}
//
#[get("/")]
async fn hello() -> impl Responder {
    info!("WE HIT HELLO");
    HttpResponse::Ok().body("Hello world!")
}

#[derive(Deserialize, Serialize)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn new(x: i32, y: i32) -> Point {
        Point { x, y }
    }
}

//#[get("/point/{x}/{y}")]
//async fn format_point(path: web::Path<(u32, u32)>) -> HttpResponse {
//    let (x, y) = path.into_inner();
//    HttpResponse::Ok()
//        .content_type("application/json")
//        .body(format!("({}, {})", x, y))
//}

#[get("/point/{x}/{y}")]
async fn format_point(path: web::Path<Point>) -> HttpResponse {
    let point = Point::new(path.x, path.y);
    let point_str = serde_json::to_string(&point).unwrap();
    HttpResponse::Ok()
        .content_type("application/json")
        .body(point_str)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(Env::default().default_filter_or("debug"));

    thread::spawn(|| loop {
        info!("THREAD IS RUNNING");
        thread::sleep(Duration::from_millis(1000));
    });
    HttpServer::new(|| {
        App::new().service(hello).service(format_point)
        //.service(echo)
        //.route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
