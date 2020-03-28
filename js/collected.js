//■glTFファイルの設定
//glTFファイルを置いた GitHub のURL
//https://github.com/siouxcitizen/3DModel/blob/master/yuusha.gltf
//
//rawgit.com 用に↑上記URLを編集（どこかのサイトでみた手順の実行）
//https://github.com/siouxcitizen/3DModel/master/yuusha.gltf
//
//編集した↑上記URLより rawgit.com で生成したURLs
// Production 用URL
//https://cdn.rawgit.com/siouxcitizen/3DModel/a1c2e475/yuusha.gltf
// Development 用URL
//https://rawgit.com/siouxcitizen/3DModel/master/yuusha.gltf
//
//
//■glTFファイル読込関連の参考サイト
//GLTFLoader
//https://threejs.org/docs/#examples/loaders/GLTFLoader
//
//MagicaVoxelの3DモデルをBlenderに持っていく
//http://b00.sakura.ne.jp/main/gamecreate/2015/10/25/post-130/
//
//BlenderでFBX形式をglTF形式に変換してThree.jsでアニメーションさせる （1/2）
//https://ryo620.org/blog/2018/02/to-gltf-from-fbx-by-blender/
//
//BlenderでFBX形式をglTF形式に変換してThree.jsでアニメーションさせる （2/2）
//https://ryo620.org/blog/2018/02/threejs-animation/
//

var scene, renderer;
var camera;
var mesh;

var isMouseDown = false;

function init() {

  //シーンを作成
  scene = new THREE.Scene();

  //カメラを作成
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.z = 25;
  camera.position.y = 15;

  //レンダラーを作成
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //背景色を設定
  renderer.setClearColor(0x00ffff, 1);
  renderer.gammaOutput = true;

  //光源を作成
  var light = new THREE.DirectionalLight("#c1582d", 1);
  var ambient = new THREE.AmbientLight("#85b2cd");
  light.position.set( 0, -70, 100 ).normalize();
  scene.add(light);
  scene.add(ambient);

  var texture = new THREE.Texture();
  var manager = new THREE.LoadingManager();
  manager.onProgress = function ( item, loaded, total ) {};
  var onProgress = function ( xhr ) {};
  var onError = function ( xhr ) {};

  // 3Dモデル用テクスチャ画像の読込
  var loader = new THREE.GLTFLoader();

  // Load a glTF resource
  loader.load(
    // resource URL
    'https://cdn.jsdelivr.net/gh/siouxcitizen/3DModel@a1c2e47550ca20de421f6d779229f66efab07830/yuusha.gltf',
    // called when the resource is loaded
    function ( gltf ) {

      mesh = gltf.scene;
      mesh.scale.set( 10, 10, 10 );
      scene.add( mesh );

      //scene.add( gltf.scene );

      //gltf.animations; // Array<THREE.AnimationClip>
      //gltf.scene; // THREE.Scene
      //gltf.scenes; // Array<THREE.Scene>
      //gltf.cameras; // Array<THREE.Camera>
      //gltf.asset; // Object

    },
    // called when loading is in progresses
    function ( xhr ) {

      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {

      console.log( 'An error happened' );

    }
  );

  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("touchstart", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("touchend", onMouseUp);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("touchmove", onMouseMove);

  render();
}

function render() {
  requestAnimationFrame( render );
  renderer.render(scene, camera);
}


// マウスを押したとき
function onMouseDown(event) {
  isMouseDown = true;
}

// マウスを動かした時
function onMouseMove(event) {
  if (isMouseDown) {
    // 3DモデルをX軸とY軸方向に回転させます
    if ( mesh ) {
      mesh.rotation.y = getMouseX(event)/50;
      mesh.rotation.x = getMouseY(event)/50;

    }
  }
}

// マウスを離したとき
function onMouseUp(event) {
  isMouseDown = false;
}

function getMouseX(event) {
  if (event.type.indexOf("touch") == -1)
    return event.clientX;
  else
    return event.touches[0].clientX;
}

function getMouseY(event) {
  if (event.type.indexOf("touch") == -1)
    return event.clientY;
  else
    return event.touches[0].clientY;
}

window.addEventListener('DOMContentLoaded', init);
