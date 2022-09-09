import {GType} from "./GType"

export interface Message<T> {
  data: T
  user: string
  type: GType
}
