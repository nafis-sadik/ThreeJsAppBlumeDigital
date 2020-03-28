let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;

let modelURL = "./../Assets/old armchair/scene.gltf";
//let modelURL = "./../Assets/sofa orange/scene.gltf";
//let modelURL = "./../Assets/sofa web/scene.gltf";
//let modelURL = "https://cdn.jsdelivr.net/gh/siouxcitizen/3DModel@a1c2e47550ca20de421f6d779229f66efab07830/yuusha.gltf";
//let modelURL = "http://nafis-sadik.byethost13.com/workspace/CodersTrustAssignment1-HTML-CSS/WebRenderer2.0/Assets/sofa_web/scene.gltf";

const aspectRatio  =  window.innerWidth / window.innerHeight;
const fov = 40;
const near = 1;
const far = 1000;

/***********Application***********/

const MainCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
const MainScene = new THREE.Scene();
const gltfLoader = new THREE.GLTFLoader();
const WebRenderer3 = new THREE.WebGLRenderer();
WebRenderer3.setSize(viewportWidth, viewportHeight);
const rotationController = new THREE.OrbitControls( MainCamera, WebRenderer3.domElement );
rotationController.minDistance = 3.2;
rotationController.maxDistance = 600;
rotationController.autoRotate = true;
rotationController.enablePan = false;
rotationController.autoRotate = true;

/***********Application***********/

/*********Post Processing*********/

// Composer & Passes
const Composer = new POSTPROCESSING.EffectComposer(WebRenderer3);
const RenderPass = new POSTPROCESSING.RenderPass(MainScene, MainCamera);
const BloomPass = new POSTPROCESSING.EffectPass(MainCamera,new POSTPROCESSING.BloomEffect());
const SMAAPass = new POSTPROCESSING.EffectPass(new POSTPROCESSING.SMAAEffect( window.innerWidth * WebRenderer3.getPixelRatio(), window.innerHeight * WebRenderer3.getPixelRatio() ));

// Adding all Passes
Composer.addPass(new POSTPROCESSING.RenderPass(MainScene, MainCamera));
Composer.addPass(BloomPass);
Composer.addPass(SMAAPass);
Composer.addPass(new POSTPROCESSING.ShaderPass(POSTPROCESSING.SepiaEffect));

// Enable all Passes
RenderPass.renderToScreen = true;
BloomPass.renderToScreen = true;
SMAAPass.renderToScreen = true;

/*********Post Processing*********/

/*********Make Responsive/*********/

window.addEventListener('resize', function () {
    viewportHeight = window.innerHeight;
    viewportWidth = window.innerWidth;
    
    MainCamera.aspect = viewportWidth/viewportHeight;
    MainCamera.updateProjectionMatrix();
    
    WebRenderer3.setSize ( viewportWidth, viewportHeight );
    Composer.setSize(viewportWidth, viewportHeight);
}, false );

/*********Make Responsive/*********/

/*************Engine*************/

let init = function () {
    THREE.Cache.enabled = true;
    WebRenderer3.setSize(viewportWidth, viewportHeight);
    $("#Viewport").append(WebRenderer3.domElement);
    MainScene.add(MainCamera);
    start();
    gameloop();
};

const clock = new THREE.Clock();
let gameloop = function(){
  update();
  // Composer.render(clock.getDelta());
  Composer.render();
  requestAnimationFrame(gameloop);
};

/*************Engine*************/

/************Toolbox*************/

let loadGLTFModel = function(url, name, defaultScale, defaultPosition, defaultRotation){
  gltfLoader.load(url,

    // called when the resource is loaded
    function (gltf) {
    let mesh = gltf.scene;
    mesh.name = name;
    mesh.scale.set(defaultScale.x, defaultScale.y, defaultScale.z);
    mesh.position.x = defaultPosition.x;
    mesh.position.y = defaultPosition.y;
    mesh.position.z = defaultPosition.z;
    mesh.rotation.set(defaultRotation.x, defaultRotation.y, defaultRotation.z);
    MainScene.add(mesh);
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

// Make Responsive
window.addEventListener('resize', function () {
  let height = window.innerHeight, width = window.innerWidth;
  MainCamera.aspect = width / height;
  MainCamera.updateProjectionMatrix();
  WebRenderer3.shadowMap.enabled = true;
  Composer.setSize(width, height);
});

/************Toolbox*************/

let start = function(){
    // Setting up the sun
    let directionalLight = new THREE.DirectionalLight("#c1582d", 1);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    directionalLight.name = "Sun";
    MainScene.add(directionalLight);

    // Setting up an ambient light
    let ambientLight = new THREE.AmbientLight("#404040",1);
    ambientLight.name = "AmbientLight1";
    MainScene.add(ambientLight);

    // Adding 4 Point Lights

    let light1 = new THREE.PointLight(0xc4c4c4,1);
    light1.position.set(0,300,500);
    MainScene.add(light1);
    let light2 = new THREE.PointLight(0xc4c4c4,1);
    light2.position.set(500,100,0);
    MainScene.add(light2);
    let light3 = new THREE.PointLight(0xc4c4c4,1);
    light3.position.set(0,100,-500);
    MainScene.add(light3);
    let light4 = new THREE.PointLight(0xc4c4c4,1);
    light4.position.set(-500,300,500);
    MainScene.add(light4);

    // 4 Point Lights Added

    // Loading 3d Model
    loadGLTFModel(modelURL, "model1", new THREE.Vector3(0.5,0.5,0.5), new THREE.Vector3(0,0,0), new THREE.Vector3(0, -45, 0));
    WebRenderer3.setClearColor("#dcdcdc", 1);
    WebRenderer3.gammaOutput = true;
    MainCamera.position.z = 250;
    MainCamera.position.y = 0;
};

let update = function(){
    rotationController.update();
};

/************Execution***********/
init();
