use std::time::{Duration, Instant};

use actix::prelude::*;
use actix_web::web::Bytes;
use actix_web_actors::ws;
use log::info;

use crate::{line::line::Line, point::point::Point, writter::writter::Writter};
use std::fs::OpenOptions;

use serde::{Deserialize, Serialize};

pub struct WebSocket;

impl WebSocket {
    pub fn new() -> Self {
        Self {}
    }
}
/// helper method that sends ping to client every 5 seconds (HEARTBEAT_INTERVAL).
///
/// also this method checks heartbeats from client
//fn hb(&self, ctx: &mut <Self as Actor>::Context) {
//    ctx.run_interval(HEARTBEAT_INTERVAL, |act, ctx| {
//        // check client heartbeats
//        if Instant::now().duration_since(act.hb) > CLIENT_TIMEOUT {
//            // heartbeat timed out
//            println!("Websocket Client heartbeat failed, disconnecting!");

//            // stop actor
//            ctx.stop();

//            // don't try to send a ping
//            return;
//        }

//        ctx.ping(b"");
//    });
//}

impl Actor for WebSocket {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        info!("STARTED CONTEXT?????");
    }
}

//#[derive(Deserialize, Serialize, Debug)]
//struct GPrimitive {
//    #[serde(alias = "type")]
//    pub t: String,
//}

#[derive(Deserialize, Serialize, Debug)]
struct Message<T> {
    pub data: T,
    pub user: String,
    #[serde(alias = "type")]
    pub t: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct Type {
    #[serde(alias = "type")]
    pub t: String,
}

// WE STILL NEED TO PARSE A LINE
fn parse_type(t: &Type, text: &Bytes) {
    match t.t.as_str() {
        "L" => {
            let line = serde_json::from_slice::<Message<Line>>(&text);
            match &line {
                Ok(lm) => {
                    info!("WE PARSED POINT: {:?}\n", lm);
                    lm.data.store(&lm.user);
                }
                Err(_) => info!("COULD NOT PARSE LINE\n"),
            }
        }
        "P" => {
            let point = serde_json::from_slice::<Message<Point>>(&text);
            match &point {
                Ok(pm) => {
                    info!("WE PARSED POINT: {:?}\n", pm);
                    pm.data.store(&pm.user);
                }
                Err(_) => info!("COULD NOT PARSE POINT\n"),
            }
        }
        _ => info!("NOT COVERED YET"),
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Text(text)) => {
                let t = serde_json::from_slice::<Type>(&text.as_bytes());
                match &t {
                    Ok(ty) => parse_type(ty, &text.as_bytes()),
                    Err(e) => info!("{:?}", e),
                }
                return ctx.text(text);
            }
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            _ => ctx.stop(),
        }
    }
}
