use actix_cors::Cors;
use actix_web::{get, web, HttpRequest, HttpResponse, HttpServer, Responder};
use actix_web::{App, Error};
use actix_web_actors::ws;
use env_logger::Env;
use log::info;
use std::{
    default,
    fmt::Debug,
    fs::{self, OpenOptions},
    io::Write,
    thread,
    time::Duration,
};

//#[get("/point")]
//async fn get_simple_point() -> impl Responder {
//    HttpResponse::Ok()
//        .content_type("application/json")
//        .body("{ type: P, X: 50, Y: 50 }")
//}
//
//

mod point;
use point::point::Point;
mod writter;
use writter::writter::Writter;
mod web_socket;
use web_socket::web_socket::WebSocket;
mod line;
//mod server;
//use self::server::MyWebSocket;

#[get("/")]
async fn hello() -> impl Responder {
    info!("WE HIT HELLO");
    HttpResponse::Ok().body("Hello world!")
}

#[get("/point/{x}/{y}")]
async fn format_point(path: web::Path<Point>) -> HttpResponse {
    let point = Point::new(path.x, path.y);
    point.store("Points.txt".to_string());
    let point_str = serde_json::to_string(&point).unwrap();
    HttpResponse::Ok()
        .content_type("application/json")
        .body(point_str)
}

#[get("/point/{user_name}")]
async fn get_user_points(path: web::Path<String>) -> HttpResponse {
    let test = fs::read_to_string(path.into_inner());
    match test {
        Ok(content) => return HttpResponse::Ok().content_type("text/plain").body(content),
        Err(err) => HttpResponse::Ok()
            .content_type("text/plain")
            .body(err.to_string()),
    }
}

async fn handle_web_soket(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    ws::start(WebSocket::new(), &req, stream)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(Env::default().default_filter_or("debug"));

    thread::spawn(|| loop {
        info!("THREAD IS RUNNING");
        thread::sleep(Duration::from_millis(1000));
    });
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_method()
            .allow_any_origin()
            .max_age(3600);
        App::new()
            .wrap(cors)
            .route("/ws", web::get().to(handle_web_soket))
            .service(hello)
            .service(format_point)
            .service(get_user_points)
        //.service(echo)
        //.route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
