import React, {createRef} from 'react';
import {CanvasWS} from './CanvasWS';
import {getStringFromType, getTypeFromString, GType} from './GType';
import {Line} from './Line';
import {Point} from './Point';
import {Renderer} from './Renderer';

type Props = {
  width: number
  height: number
}

type State = {
  text: string
  counter: number
  width: number
  height: number
  graphicsType: GType
  user: string
  color: string
}

export type Point2D = {
  x: number,
  y: number
}

class App extends React.Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>
  private ws: CanvasWS
  private renderer: Renderer
  private tempCoords: Point2D[]
  private menuHeight: number
  constructor(props: Props) {
    super(props)
    this.menuHeight = 0
    this.renderer = new Renderer()
    this.tempCoords = []
    // PAY ATTENTION TO THE PORT
    this.ws = new CanvasWS("ws://127.0.0.1:8080/ws")
   // this.ws.onopen = (event) => {
   //   this.ws.send("CLIENT SENT YOU THIS")
   // }


    this.canvasRef = createRef()
    this.state = {
      text: "",
      counter: 0,
      width: props.width,
      height: props.height,
      user: "TIM",
      color: "#FFFF00",
      graphicsType: GType.None
    }
  }

  clearScreen() {
    if (this.canvasRef.current) {
      const canvas = this.canvasRef.current
      const context = canvas.getContext("2d")
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.width !== prevState.width || this.state.height !== prevState.height) {
      this.clearScreen()
      this.renderer.renderAll()
    }
  }


  componentDidMount() {
    window.addEventListener('resize', () => this.updateDimensions());
    this.updateDimensions()
  }

  private getContext(): CanvasRenderingContext2D | null {
    if (this.canvasRef.current) {
      const canvas = this.canvasRef.current
      const context = canvas.getContext("2d")
      if (context) {
        return context
      }
    }
    return null
  }

  updateDimensions() {
    const menu = document.getElementById("menu") as HTMLDivElement
    this.menuHeight = menu.offsetHeight
    this.setState({width: window.innerWidth, height: window.innerHeight});
  }

  handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      graphicsType: getTypeFromString(e.target.value)
    })
  }

  render(): React.ReactNode {
    return (
      <>
      <div id="menu" style={{border: '1px solid blue', display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center"}}>
          <label htmlFor="primitive" style={{ marginRight: "0.5vw", marginLeft: "0.5vw"}} >Primitive: </label>
          <select id="primitive" value={this.state.graphicsType} onChange={(e) => this.handleSelect(e)}>
            <option value={GType.Line}>{getStringFromType(GType.Line)}</option>
            <option value={GType.Point}>{getStringFromType(GType.Point)}</option>
            <option value={GType.None}>{getStringFromType(GType.None)}</option>
          </select>
          <label style={{ marginRight: "0.5vw", marginLeft: "0.5vw"}} htmlFor="user">User: </label>
          <input value={this.state.user} onChange={(e) => this.handleUserChange(e)} />
          <input type="color" style={{ marginRight: "0.5vw", marginLeft: "0.5vw"}} value={this.state.color} onChange={(e) => this.handleColorChange(e)} />
        </div>
        <canvas id="user" onClick={(e) => this.handleCanvasClick(e)} style={{
          border: '1px solid red',
        }} ref={this.canvasRef} height={this.state.height - 2 - this.menuHeight } width={this.state.width - 2} />
      </>
    )
  }

  handleColorChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({color: e.currentTarget.value})
  }

  handleUserChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({user: e.currentTarget.value})
  }

  handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
    const canvas = this.canvasRef.current
    const ctx = this.getContext()
    if (canvas) {
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        switch (this.state.graphicsType) {
          case GType.Point:
            const tempPoint = new Point(ctx, e.clientX - rect.left, e.clientY - rect.top, this.state.color)
            this.renderer.addMesh(tempPoint)
            this.ws.sendPoint(tempPoint, this.state.user)
            this.clearScreen()
            this.renderer.renderAll()
            break;
          case GType.Line:
            this.tempCoords.push({x: e.clientX - rect.left, y: e.clientY - rect.top})
            if (this.tempCoords.length === 2) {
              const tempLine = new Line(ctx, this.tempCoords[0], this.tempCoords[1], this.state.color)
              this.renderer.addMesh(tempLine)
              this.ws.sendLine(tempLine, this.state.user)
              this.clearScreen()
              this.renderer.renderAll()
              this.tempCoords = []
            } break

          default:
            break;
        }
      }
    }
  }

  onButtonClick(): void {
    if (this.ws.isOpen()) {
      this.ws.send("HAHA YOU GAY")
    } else {
      alert("BRO THIS IS CLOSED")
    }
    this.setState((state) => (
      {
        counter: state.counter + 1
      }
    ))
  }

  onInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.setState((state) => ({
      text: e.target.value
    }))
  }
}


export default App;
