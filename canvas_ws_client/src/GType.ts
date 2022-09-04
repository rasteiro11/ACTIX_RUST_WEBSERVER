
export enum GType {
  Line = "Line",
  Point = "Point",
  None = "None"
}

export function getTypeFromString(s: string): GType {
  switch (s) {
    case "Point":
      return GType.Point
    case "Line":
      return GType.Line
    default:
      return GType.None
  }
}
