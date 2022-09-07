export interface GPrimitive {
  context: CanvasRenderingContext2D
  type: string
  draw(): void;
}
