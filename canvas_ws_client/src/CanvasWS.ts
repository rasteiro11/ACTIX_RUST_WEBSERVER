import {GType} from "./GType"
import {Line} from "./Line"
import {Point} from "./Point"
import {SendMessage} from "./SendMessage"

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
  public sendPoint(p: Point) {
    if (this.isOpen()) {
      this.send(JSON.stringify(p, (key, value) => {
        if (key === "context") return undefined
        return value
      }))
    } else {
      console.log("CONN IS CLOSED")
    }
  }

  //public sendPoint(p: Point) {
  //  if (this.isOpen()) {
  //    const pointMessage = new SendMessage<Point>(p, GType.Point, "TEST.txt")
  //    console.log("SOCKET IS CONNECTED")
  //    this.send(JSON.stringify(pointMessage, (key, value) => {
  //      if (key === "context") return undefined
  //      return value
  //    }))
  //  } else {
  //    console.log("SOCKET IS NOT CONNECTED")
  //  }
  //}

  public sendLine(l: Line) {
    const lineMessage = new SendMessage<Line>(l, GType.Line, "TEST.txt")
    if (this.isOpen()) {
      console.log("SOCKET IS CONNECTED")
      this.send(JSON.stringify(lineMessage, (key, value) => {
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
