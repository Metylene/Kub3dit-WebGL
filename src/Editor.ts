import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import VoxelWorld from './VoxelWorld/VoxelWorld';
import { XYZ } from "./Utils/XYZ";
import { Utils } from "./Utils/Utils";
import { Color, WebGLRenderer, DirectionalLight, PerspectiveCamera, Scene } from "three";

export class Editor {

    world : VoxelWorld;
    renderRequested = false;

    renderer : WebGLRenderer;

    controls : OrbitControls;
    camera: PerspectiveCamera;
    scene: Scene;

    main(){
        const canvas = document.querySelector('#c') as HTMLCanvasElement;
        this.renderer = new WebGLRenderer({canvas});
    
        this.scene = new Scene();
        this.scene.background = new Color("lightblue");
    
        const worldSize : XYZ.type = { x : 64, y : 32, z : 64 };
        const cellSize = 32;

        function addLight(scene : Scene, position : XYZ.type) {
          const color = 0xFFFFFF;
          const intensity = 1;
          const light = new DirectionalLight(color, intensity);
          light.position.set(position.x, position.y, position.z);
          scene.add(light);
        }
        addLight(this.scene, {x:-1,  y:2,  z:4});
        addLight(this.scene, {x:1,  y:-1,  z:-2});

        this.camera = new PerspectiveCamera(75, 2);
        this.camera.position.set(-cellSize * .3, cellSize * .8, -cellSize * .3);

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.target.set(cellSize / 2, cellSize / 3, cellSize / 2);
        this.controls.update();

        this.world = new VoxelWorld(worldSize, {cellSize: cellSize});
        for (let y = 0; y < worldSize.y; y++) {
            for (let z = 0; z < worldSize.z; z++) {
                for (let x = 0; x < worldSize.x; x++) {
                    const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
                    if(y < height) {
                        const voxelId = Utils.randomInt(0, 17);
                        this.world.setVoxel({x, y, z}, voxelId);
                    }
                }
            }
        }
        let meshArray = this.world.generateCellsMeshArray();
        for (let i = 0; i < meshArray.length; i++) {
            const mesh = meshArray[i];
            this.scene.add(mesh);
        }
        this.render();

        let editor = this;
        this.controls.addEventListener('change', () => editor.requestRenderIfNotRequested());
        window.addEventListener('resize', () => editor.requestRenderIfNotRequested());
    }

    private resizeRendererToDisplaySize(renderer : WebGLRenderer) {
      const canvas = this.renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        this.renderer.setSize(width, height, false);
      }
      return needResize;
    }
        
    requestRenderIfNotRequested() {
        if (!this.renderRequested) {
            this.renderRequested = true;
            const editor = this;
            requestAnimationFrame(() => editor.render());
        }
    }

    render() {
      this.renderRequested = undefined;

      if (this.resizeRendererToDisplaySize(this.renderer)) {
        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
      }
      console.log("Render");
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
    
    

}
