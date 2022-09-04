import React, {createRef} from 'react';
import {getTypeFromString, GType} from './GType';
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
}

export type Point2D = {
  x: number,
  y: number
}

class App extends React.Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>
  private ws: WebSocket
  private renderer: Renderer
  private tempCoords: Point2D[]
  private menuHeight: number
  constructor(props: Props) {
    super(props)
    this.menuHeight = 0
    this.renderer = new Renderer()
    this.tempCoords = []
    // PAY ATTENTION TO THE PORT
    this.ws = new WebSocket("ws://127.0.0.1:8080/ws")
    this.ws.onopen = (event) => {
      this.ws.send("CLIENT SENT YOU THIS")
    }


    this.canvasRef = createRef()
    this.state = {
      text: "",
      counter: 0,
      width: props.width,
      height: props.height,
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
    window.addEventListener('resize', this.updateDimensions);
    
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

  updateDimensions = () => {
    const menu = document.getElementById("menu") as HTMLDivElement
    this.menuHeight = menu.offsetHeight
    this.setState({width: window.innerWidth, height: window.innerHeight});
    //console.log("WINDOW HEIGHT: ", window.innerHeight)
    //console.log(menu.offsetHeight)
  };

  //<input onChange={(e) => this.onInputChange(e)}></input>
  //<p>
  //  {this.state.text}
  //</p>
  //<button onClick={() => this.onButtonClick()}>Click Me</button>
  //<p>{this.state.counter}</p>

  handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      graphicsType: getTypeFromString(e.target.value)
    })
  }

  render(): React.ReactNode {
    return (
      <>
      <div id="menu" style={{border: '1px solid blue', display: 'flex', flexDirection: 'row'}}>
          <select value={this.state.graphicsType} onChange={(e) => this.handleSelect(e)}>
            <option value={GType.Line}>{GType.Line}</option>
            <option value={GType.Point}>{GType.Point}</option>
            <option value={GType.None}>{GType.None}</option>
          </select>
        </div>
        <canvas onClick={(e) => this.handleCanvasClick(e)} style={{
          border: '1px solid red',
        }} ref={this.canvasRef} height={this.state.height - 2 - this.menuHeight } width={this.state.width - 2} />
      </>
    )
  }

  handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
    const canvas = this.canvasRef.current
    const ctx = this.getContext()
    const color = 'rgba(255, 255, 0, 255)'
    if (canvas) {
      if (ctx) {
        const rect = canvas.getBoundingClientRect()
        switch (this.state.graphicsType) {
          case GType.Point:
            console.log("ADDING POINT")
            this.renderer.addMesh(new Point(ctx, e.clientX - rect.left, e.clientY - rect.top, color))
            this.clearScreen()
            this.renderer.renderAll()
            break;
          case GType.Line:
            this.tempCoords.push({x: e.clientX - rect.left, y: e.clientY - rect.top})
            if (this.tempCoords.length === 2) {
              this.renderer.addMesh(new Line(ctx, this.tempCoords[0], this.tempCoords[1], color))
              console.log("ADDING LINE")
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
    if (this.ws.readyState === WebSocket.OPEN) {
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
