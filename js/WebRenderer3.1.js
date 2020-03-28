/***********Application***********/

let modelURL1 = "./assets/chopper/scene.gltf";
let modelURL2 = "./assets/colourdraftssimon_stalenhag_scene/scene.gltf";

/***********System Config***********/
import { FXAAShader } from "../lib/FXAAShader.js";
import { ShaderPass } from '../lib/postprocessing/src/passes/ShaderPass.js';
import { RenderPass } from '../lib/postprocessing/src/passes/RenderPass.js';

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
  gltfLoader : new THREE.GLTFLoader(),
  Renderer : new THREE.WebGLRenderer({antialias:true})
};

const Composer = new POSTPROCESSING.EffectComposer(WebRenderer3.Renderer);

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

  let bloomPass = new POSTPROCESSING.EffectPass(WebRenderer3.MainCamera, new POSTPROCESSING.BloomEffect());

  let FXAAPass = new ShaderPass( FXAAShader );
  FXAAShader.uniforms[ 'resolution' ].value.x = 1 / ( RendererConfig.Width * RendererConfig.AspectRatio );
  FXAAShader.uniforms[ 'resolution' ].value.y = 1 / ( RendererConfig.Height * RendererConfig.AspectRatio );

  bloomPass.renderToScreen = true;
  FXAAPass.renderToScreen = true;

  Composer.addPass(renderPass);
  Composer.addPass(bloomPass);
  Composer.addPass(FXAAPass);
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

const OrbitController = new THREE.OrbitControls( WebRenderer3.MainCamera, WebRenderer3.Renderer.domElement );

let ConfigureOrbitController = function(){
  OrbitController.minDistance = 100;
  OrbitController.maxDistance = 1000;
  OrbitController.autoRotate = false;
  OrbitController.enablePan = false;
};

let GLTFLoader = function(url, name, defaultScale, defaultPosition, defaultRotation, parentObject){
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
  $("#Viewport").append(WebRenderer3.Renderer.domElement);
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
let ChopperRef = new THREE.Object3D();
ChopperRef.name = 'ChopperRef';
ChopperRef.position.set(0, 0, 0);
WebRenderer3.MainScene.add(ChopperRef);

let choperFan1 = WebRenderer3.MainScene.getObjectByName('static_rotor');
let choperFan2 = WebRenderer3.MainScene.getObjectByName('static_rotor2');
let start = function(){
  skyBox('assets/SkyBox/front.png', 'assets/SkyBox/back.png', 'assets/SkyBox/up.png', 'assets/SkyBox/down.png', 'assets/SkyBox/left.png', 'assets/SkyBox/right.png');

  /* Setting up the sun -- recommended for yellowish light #c1582d*/
  let Sun = AddLight("DirectionalLight", "#aac0c0", true, "Sun");
  Sun.position.set(9, 90, 9);

  // Adding Lights
  let PointLight3 = AddLight("PointLight", '#abbdc1', true, "PointLight3");
  PointLight3.position.set(0,300,-500);
  let PointLight2 = AddLight("PointLight", '#abbdc1', true, "PointLight2");
  PointLight2.position.set(500,300,0);
  let PointLight4 = AddLight("PointLight", '#708dc1', true, "PointLight4 ");
  PointLight4.position.set(-500,300,500);

  // Lights Added

  // Loading 3d Model
  GLTFLoader(modelURL1, "model1", new THREE.Vector3(0.02, 0.02, 0.02), new THREE.Vector3(0, 20, 100), new THREE.Vector3(0, -90, 0), ChopperRef);
  GLTFLoader(modelURL2, "model2", new THREE.Vector3(200, 200, 200), new THREE.Vector3(0, -50, 0), new THREE.Vector3(0, 0, 0));
  WebRenderer3.Renderer.setClearColor();
  WebRenderer3.Renderer.gammaOutput = true;
  WebRenderer3.MainCamera.position.z = 250;
  WebRenderer3.MainCamera.position.y = 0;
};


let update = function(){
  // Chopper rotation
  ChopperRef.rotation.set(ChopperRef.rotation.x, ChopperRef.rotation.y + (0.5 * clock.getDelta()), ChopperRef.rotation.z);

  // Chopper fans
  if(choperFan1 !== undefined){
    //choperFan1.rotation.set(choperFan1.rotation.x, choperFan1.rotation.y + (10 * clock.getDelta()), choperFan1.rotation.z);
    choperFan1.rotation.y += 15 * (Math.PI / 180);
  } else {
    choperFan1 = WebRenderer3.MainScene.getObjectByName('static_rotor');
  }
  if(choperFan2 !== undefined){
    choperFan2.rotation.set(choperFan2.rotation.x, choperFan2.rotation.y, choperFan2.rotation.z);
  } else {
    choperFan2 = WebRenderer3.MainScene.getObjectByName('static_rotor2');
  }

  // Orbit Control update
  OrbitController.update();
};

/************Execution***********/
init();
