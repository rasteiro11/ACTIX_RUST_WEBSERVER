import {GType} from "./GType"
import {Line} from "./Line"
import {Message} from "./Message"
import {Point} from "./Point"


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
      const m: Message<Point> = {data: p, user, type: GType.Point}
      this.send(JSON.stringify(m, (key, value) => {
        if (key === "context") return undefined
        return value
      }))
    } else {
      console.log("CONN IS CLOSED")
    }
  }

  public sendLine(l: Line, user: string) {
    const m: Message<Line> = {data: l, user, type: GType.Line}
    if (this.isOpen()) {
      this.send(JSON.stringify(m, (key, value) => {
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
