/***********Application***********/

let modelURL1 = "../assets/armchair/scene.gltf";

/***********System Config***********/
import * as THREE from '../lib/threejs/build/three.module.js';
import { GLTFLoader } from '../lib/threejs/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from '../lib/threejs/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../lib/threejs/examples/jsm/postprocessing/RenderPass.js';
import { SMAAPass } from '../lib/threejs/examples/jsm/postprocessing/SMAAPass.js';
import { OrbitControls } from '../lib/threejs/examples/jsm/controls/OrbitControls.js';
import { UnrealBloomPass } from '../lib/threejs/examples/jsm/postprocessing/UnrealBloomPass.js';

const RendererConfig = {
  Width : window.innerWidth,
  Height : window.innerHeight,
  AspectRatio: window.innerWidth / window.innerHeight,
  FieldOfView: 45,
  NearPane: 1,
  FarPane: 10000
};

const WebRenderer3 = {
  MainCamera : new THREE.PerspectiveCamera(RendererConfig.FieldOfView, RendererConfig.AspectRatio, RendererConfig.NearPane, RendererConfig.FarPane),
  MainScene : new THREE.Scene(),
  gltfLoader : new GLTFLoader(),
  Renderer : new THREE.WebGLRenderer({antialias:true})
};

const Composer = new EffectComposer(WebRenderer3.Renderer);

let ConfigureRenderer = function(){
  RendererConfig.Width = window.innerWidth;
  RendererConfig.Height = window.innerHeight;
  RendererConfig.AspectRatio = window.innerWidth / window.innerHeight;

  // Set size
  WebRenderer3.Renderer.setSize ( RendererConfig.Width, RendererConfig.Height );
  Composer.setSize(RendererConfig.Width, RendererConfig.Height);

  // Update Aspect Ratio
  WebRenderer3.MainCamera.aspect = WebRenderer3.Renderer.getPixelRatio();

  // Preparing Post Processing
  let renderPass = new RenderPass (WebRenderer3.MainScene, WebRenderer3.MainCamera);
  Composer.addPass(renderPass);

  let bloomPass = new UnrealBloomPass(new THREE.Vector2( RendererConfig.Width, RendererConfig.Height ));
  bloomPass.exposure = 1.2;
  bloomPass.threshold = 0;
  bloomPass.strength = 0.25;
  bloomPass.radius = 1;
	Composer.addPass(bloomPass);

  let smaaPass = new SMAAPass(RendererConfig.Width * RendererConfig.AspectRatio, RendererConfig.Height * RendererConfig.AspectRatio);
  Composer.addPass(smaaPass);
};
/***********System Config***********/

/********* Make Responsive *********/
window.addEventListener('resize', function () {
  ConfigureRenderer();
  WebRenderer3.MainCamera.updateProjectionMatrix();
}, false );
/********* Make Responsive *********/

/***********Engine Tools***********/
const clock = new THREE.Clock();

let box = function (x, y, z, material) {
  let geometry = new THREE.BoxGeometry( x, y, z );
  if (material === undefined) { material = new THREE.MeshBasicMaterial( { color:0xFFFFFF, wireframe: false, side: THREE.BackSide } ); }
  let mesh = new THREE.Mesh( geometry, material );
  WebRenderer3.MainScene.add(mesh);
  return mesh;
};

let skyBox = function (front, back, up, down, left, right) {
  // Sky Box Material
  let skyBoxTextures = [
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(front), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(back), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(up), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(down), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(right), side: THREE.BackSide } ),
    new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(left), side: THREE.BackSide } )
  ];
  let theSkyBox = new box( 5000, 5000, 5000, skyBoxTextures );
  WebRenderer3.MainScene.add(theSkyBox);

  // Sky box Mesh & Texture mapping
  return theSkyBox;
};

const OrbitController = new OrbitControls( WebRenderer3.MainCamera, WebRenderer3.Renderer.domElement );

let ConfigureOrbitController = function(){
  OrbitController.minDistance = 100;
  OrbitController.maxDistance = 1000;
  OrbitController.autoRotate = true;
  OrbitController.enablePan = false;
  OrbitController.enableDamping = true;
};

let ModelLoader_GLTF = function(url, name, defaultScale, defaultPosition, defaultRotation, parentObject){
  WebRenderer3.gltfLoader.load(url,
    // called when the resource is loaded
    function (gltf) {
      let mesh = gltf.scene;
      mesh.name = name;
      mesh.scale.set(defaultScale.x, defaultScale.y, defaultScale.z);
      mesh.position.x = defaultPosition.x;
      mesh.position.y = defaultPosition.y;
      mesh.position.z = defaultPosition.z;
      mesh.rotation.set(defaultRotation.x, defaultRotation.y, defaultRotation.z);
      WebRenderer3.MainScene.add(mesh);
      if(parentObject !== undefined && parentObject !== null){
        parentObject.add(mesh);
        console.log(mesh);
        return mesh;
      }
    },
    // called when loading is in progresses
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    // called when loading has errors
    function ( error ) {
      console.log( 'An error occured' );
      console.log(error);
    });
};

let AddLight = function(type, color = "#c1582d", shadow = true, name){
  let Light;
  switch (type) {
    case "DirectionalLight":
      Light = new THREE.DirectionalLight(color, 1);
      Light.castShadow = shadow;
      Light.name = name;
      WebRenderer3.MainScene.add(Light);
      break;
    case "AmbientLight":
      Light = new THREE.AmbientLight(color,1);
      Light.name = name;
      WebRenderer3.MainScene.add(Light);
      break;
    case "PointLight":
      Light = new THREE.PointLight(color,1);
      Light.castShadow = shadow;
      Light.name = name;
      WebRenderer3.MainScene.add(Light);
      break;
  }
  return Light;
};
/***********Engine Tools***********/

/*************Engine*************/
let init = function () {
  THREE.Cache.enabled = true;
  WebRenderer3.Renderer.shadowMap.enabled = true;
  ConfigureOrbitController();
  ConfigureRenderer();
  WebRenderer3.MainScene.add(WebRenderer3.MainCamera);
  document.getElementById('Viewport').append(WebRenderer3.Renderer.domElement);
  start();
  GameLoop();
};

let GameLoop = function(){
  update();
  //WebRenderer3.Renderer.render(WebRenderer3.MainScene, WebRenderer3.MainCamera);
  Composer.render();
  requestAnimationFrame(GameLoop);
};

/*************Engine*************/
let start = function(){
  skyBox('../assets/SkyBox/front.png', '../assets/SkyBox/back.png', '../assets/SkyBox/up.png', '../assets/SkyBox/down.png', '../assets/SkyBox/left.png', '../assets/SkyBox/right.png');

  let Sun = AddLight("DirectionalLight", "#aac0c0", true, "Sun");
  Sun.position.set(25, 90, 25);

  // Adding Lights
  let PointLight1 = AddLight("PointLight", '#abbdc1', true, "PointLight2");
  PointLight1.position.set(500,300,0);
  let PointLight2 = AddLight("PointLight", '#708dc1', true, "PointLight4 ");
  PointLight2.position.set(-500,300,500);
  let PointLight3 = AddLight("PointLight", '#708dc1', true, "PointLight4 ");
  PointLight3.position.set(0,300,0);
  // Lights Added

  // Loading 3d Model
  let armChair = ModelLoader_GLTF(modelURL1, "model1", new THREE.Vector3(0.1, 0.1, 0.1), new THREE.Vector3(0, -50, 0), new THREE.Vector3(0, 0, 0));
  WebRenderer3.Renderer.setClearColor();
  WebRenderer3.Renderer.gammaOutput = true;
  WebRenderer3.MainCamera.position.z = 250;
  WebRenderer3.MainCamera.position.y = 0;

  console.log(armChair);
};


let update = function(){
  // Orbit Control update
  OrbitController.update();
};

/************Execution***********/
init();
