import {GPrimitive} from "./GPrimitive";
import {GType} from "./GType";

export class Point implements GPrimitive {
  context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D, private x: number, private y: number, private color: string) {
    this.context = context
  }

  getX() {return this.x}
  getY() {return this.y}

  draw(): void {
    //ctx.fillStyle = 'rgba(255, 255, 0, 255)'
    //ctx.fillRect(e.clientX - rect.left, e.clientY - rect.top, 1, 1)
    //ctx.stroke();
    this.context.fillStyle = this.color
    this.context.fillRect(this.x, this.y, 1, 1)
    this.context.stroke()
  }
}
