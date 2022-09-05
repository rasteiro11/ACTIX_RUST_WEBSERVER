
export enum GType {
  Line = 'L',
  Point = 'P',
  None = 'N'
}

export function getTypeFromString(s: string): GType {
  switch (s) {
    case "P":
      return GType.Point
    case "L":
      return GType.Line
    default:
      return GType.None
  }
}
