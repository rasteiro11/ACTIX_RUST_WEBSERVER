use std::time::{Duration, Instant};

use actix::prelude::*;
use actix_web_actors::ws;
use log::info;

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

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocket {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        // process websocket messages
        println!("WS: {msg:?}");
        match msg {
            //Ok(ws::Message::Ping(msg)) => {
            //    self.hb = Instant::now();
            //    ctx.pong(&msg);
            //}
            //Ok(ws::Message::Pong(_)) => {
            //    self.hb = Instant::now();
            //}
            Ok(ws::Message::Text(text)) => {
                print!("{}", text);
                ctx.text(text)
            }
            // Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            _ => ctx.stop(),
        }
    }
}
