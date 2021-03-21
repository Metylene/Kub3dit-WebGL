import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import VoxelWorld from './VoxelWorld/VoxelWorld';
import { multiplyBy, XYZ } from "./Utils/XYZ";
import { Utils } from "./Utils/Utils";
import { Color, WebGLRenderer, DirectionalLight, PerspectiveCamera, Scene, MeshLambertMaterial, Fog, MeshBasicMaterial, DirectionalLightHelper, MOUSE } from "three";
declare let window;

export class Editor {

    world: VoxelWorld;
    renderRequested = false;

    material = new MeshLambertMaterial({ color: 0x1167B1 });
    translucentMaterial = new MeshBasicMaterial( { color: 0xff0000, transparent: true, opacity: 0.5 } );
    renderer: WebGLRenderer;

    controls: OrbitControls;
    camera: PerspectiveCamera;
    scene: Scene;

    private resizeRendererToDisplaySize() {
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

        if (this.resizeRendererToDisplaySize()) {
            const canvas = this.renderer.domElement;
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    private generateAllMesh() {
        for (const cellId in this.world.cells) {
            const cell = this.world.cells[cellId];
            let material : any = this.material;
            if(Math.random() > 0.7){
                material = this.translucentMaterial;
            }
            let mesh = cell.generateMesh(material);
            this.scene.add(mesh);

            const voxelOrigineCell = multiplyBy(cell.position, this.world.cellSize)
            mesh.position.set(voxelOrigineCell.x, voxelOrigineCell.y, voxelOrigineCell.z);
        }
    }

    updateGeometry(){
        for (const cellId in this.world.cells) {
            const cell = this.world.cells[cellId];
            let mesh = cell.mesh;
            if(!mesh){
                mesh = cell.generateMesh(this.material);
                this.scene.add(mesh);
            }

            const voxelOrigineCell = multiplyBy(cell.position, this.world.cellSize)
            mesh.position.set(voxelOrigineCell.x, voxelOrigineCell.y, voxelOrigineCell.z);
        }
    }

    main() {
        const canvas = document.querySelector('#c') as HTMLCanvasElement;
        this.renderer = new WebGLRenderer({ canvas });

        this.scene = new Scene();
        this.scene.background = new Color("lightblue");
        this.scene.fog = new Fog( "lightblue", 64, 100 );

        const worldSize: XYZ = { x: 256, y: 32, z: 256 };
        const cellSize = 32;

        function addLight(scene: Scene, position: XYZ) {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new DirectionalLight(color, intensity);
            light.position.set(position.x, position.y, position.z);
            scene.add(light);
            const helper = new DirectionalLightHelper(light);
            scene.add(helper);
        }
        addLight(this.scene, { x: -1, y: 2, z: 4 });
        addLight(this.scene, { x: 1, y: -1, z: -2 });

        this.camera = new PerspectiveCamera(75, 2);
        this.camera.position.set(worldSize.x /2, cellSize * .5, worldSize.z /2);

        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.target.set(worldSize.x / 2 -cellSize * .3, cellSize / 3, worldSize.z / 2 -cellSize * .3);
        this.controls.maxDistance = 50;
        this.controls.enableZoom = false;
        this.controls.screenSpacePanning = false;
        this.controls.keyPanSpeed = 100.0;
        this.controls.listenToKeyEvents(window);
        this.controls.mouseButtons = {
            LEFT: MOUSE.PAN,
            MIDDLE: MOUSE.ROTATE,
            RIGHT: MOUSE.ROTATE
        }
        this.controls.keys = {
            LEFT: 81, // Q
            UP: 90, // Z
            RIGHT: 68, // D
            BOTTOM: 83 // S
        }
        this.controls.update();

        // 3 axes at 0,0,0 to help visualizing space
        // this.scene.add( new AxesHelper( 20 ) );

        this.world = new VoxelWorld(worldSize, { cellSize: cellSize });
        for (let y = 0; y < worldSize.y; y++) {
            for (let z = 0; z < worldSize.z; z++) {
                for (let x = 0; x < worldSize.x; x++) {
                    const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
                    if (y < height) {
                        const voxelId = Utils.randomInt(1, 20);
                        this.world.setVoxel({ x, y, z }, voxelId);
                    }
                }
            }
        }

        this.generateAllMesh();
        this.render();

        let editor = this;
        this.controls.addEventListener('change', () => editor.requestRenderIfNotRequested());
        window.addEventListener('resize', () => editor.requestRenderIfNotRequested());
        window.addEventListener("keydown", event => {
            if (event.isComposing || event.keyCode === 229) {
              return;
            }
            if (event.code === "ShiftLeft") {
                this.controls.screenSpacePanning = !this.controls.screenSpacePanning;
            }
        });
        // window.addEventListener("keyup", event => {
        //     if (event.isComposing || event.keyCode === 229) {
        //       return;
        //     }
        //     if (event.code === "ShiftLeft") {
        //         this.controls.screenSpacePanning = !this.controls.screenSpacePanning;
        //     }
        // });
    }



}
