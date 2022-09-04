import {GPrimitive} from "./GPrimitive";

export class Renderer {
  private meshes: GPrimitive[]

  constructor() {
    this.meshes = []
  }

  addMesh(mesh: GPrimitive) {
    this.meshes.push(mesh)
  }

  renderAll() {
    console.log("RENDERING AGAIN")
    this.meshes.forEach(mesh => {
      mesh.draw()
    });
  }
}

