
export enum GType {
  Line = 'L',
  Point = 'P',
  None = 'N'
}

export function getStringFromType(t: GType): string  {
  switch (t) {
    case GType.Point:
      return "Point" 
    case GType.Line:
      return "Line" 
    default:
      return "None" 
  }
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
