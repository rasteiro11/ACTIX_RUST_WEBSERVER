import {Line} from "./Line"
import {Point} from "./Point"

export interface ClientMessage<T> {
  data: T 
  user: string
}

export class CanvasWS extends WebSocket {
  constructor(url: string) {
    super(url)

    this.onopen = (event) => {
      this.send("CLIENT SENT YOU THIS")
    }

    this.onmessage = (me: MessageEvent<any>) => {
      console.log(me)
    }

  }
  public sendPoint(p: Point, user: string) {
    if (this.isOpen()) {
       const cm: ClientMessage<Point> = {data: p, user}
      this.send(JSON.stringify(p, (key, value) => {
        if (key === "context") return undefined
        return value
      }))
    } else {
      console.log("CONN IS CLOSED")
    }
  }

  public sendLine(l: Line) {
    if (this.isOpen()) {
      // console.log("LINE: ", l)
      this.send(JSON.stringify(l, (key, value) => {
        if (key === "context") return undefined
        return value
      }))
    } else {
      console.log("SOCKET IS NOT CONNECTED")
    }

  }

  public isOpen(): boolean {
    return (this.readyState === WebSocket.OPEN) ? true : false
  }

}
