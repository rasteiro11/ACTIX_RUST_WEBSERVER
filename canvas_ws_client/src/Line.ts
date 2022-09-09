import {Point2D} from "./App";
import {GPrimitive} from "./GPrimitive";
import {GType} from "./GType";

export class Line implements GPrimitive {
  context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D, private p1: Point2D, private p2: Point2D, private color: string) {
    this.context = context
  }

  draw(): void {
    this.context.strokeStyle = this.color
    this.context.lineWidth = 1
    this.context.beginPath()
    this.context.moveTo(this.p1.x, this.p1.y)
    this.context.lineTo(this.p2.x, this.p2.y)
    this.context.stroke()
  }
}
