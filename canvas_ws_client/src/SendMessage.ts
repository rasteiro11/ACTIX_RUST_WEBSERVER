import {GType} from "./GType"

export class SendMessage<T> {

  constructor(private msg: T, private type: GType, private user: string) {
  }

  public getType() {return this.type}
  public getMsg() {return this.msg}
  public getUser() {return this.user}
}
