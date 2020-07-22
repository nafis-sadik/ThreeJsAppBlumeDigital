

			var stats = new Stats();

			import * as THREE from '../build/three.module.js';
			import Stats from './jsm/libs/stats.module.js';
			import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
			import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
			import { RenderPass } from './jsm/postprocessing/RenderPass.js';
			import { SMAAPass } from './jsm/postprocessing/SMAAPass.js';
			
			const RendererConfig = {
				Width : window.innerWidth,
				Height : window.innerHeight,
				AspectRatio: window.innerWidth / window.innerHeight,
				FieldOfView: 70,
				NearPane: 1,
				FarPane: 1000
			};

			const WebRenderer3 = {
				MainCamera : new THREE.PerspectiveCamera(RendererConfig.FieldOfView, RendererConfig.AspectRatio, RendererConfig.NearPane, RendererConfig.FarPane),
				MainScene : new THREE.Scene(),
				gltfLoader : new GLTFLoader(),
				Renderer : new THREE.WebGLRenderer({antialias:true})
			};
			
			let composer = new EffectComposer( WebRenderer3.Renderer );

function ConfigureRenderer(){
	// Update Size & Aspect Ratio
	RendererConfig.Width = window.innerWidth;
	RendererConfig.Height = window.innerHeight;
	WebRenderer3.Renderer.setSize( RendererConfig.Width, RendererConfig.Height );
	
	RendererConfig.AspectRatio = WebRenderer3.Renderer.getPixelRatio();
	WebRenderer3.Renderer.setPixelRatio( RendererConfig.AspectRatio );
	
	WebRenderer3.MainCamera.aspect = RendererConfig.AspectRatio;

	// Preparing Post Processing
	composer = new EffectComposer( WebRenderer3.Renderer );

	let renderPass = new RenderPass( WebRenderer3.MainScene, WebRenderer3.MainCamera );
	composer.addPass( renderPass );

	let smaaPass = new SMAAPass( RendererConfig.Width * RendererConfig.AspectRatio, RendererConfig.Height * RendererConfig.AspectRatio );
	composer.addPass( smaaPass );
}

function init() {
	THREE.Cache.enabled = true;
	  WebRenderer3.Renderer.shadowMap.enabled = true;
	var container = document.getElementById( "viewport" );
	document.body.appendChild( WebRenderer3.Renderer.domElement );

	stats = new Stats();
	container.appendChild( stats.dom );
	ConfigureRenderer();				

	window.addEventListener( 'resize', onWindowResize, false );
	start();
	gameloop();
}

function gameloop() {
	update();
	requestAnimationFrame( gameloop );
	stats.begin();
	composer.render();
	stats.end();
}

function onWindowResize() {
	ConfigureRenderer();
	WebRenderer3.MainCamera.updateProjectionMatrix();
}

function start(){				
	WebRenderer3.MainCamera.position.z = 300;
	let geometry = new THREE.BoxBufferGeometry( 120, 120, 120 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );

	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.x = - 100;
	WebRenderer3.MainScene.add( mesh );

	var texture = new THREE.TextureLoader().load( "textures/brick_diffuse.jpg" );
	texture.anisotropy = 4;

	var material = new THREE.MeshBasicMaterial( { map: texture } );

	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.x = 100;
	WebRenderer3.MainScene.add( mesh );
}

function update() {
	for ( var i = 0; i < WebRenderer3.MainScene.children.length; i ++ ) {
		var child = WebRenderer3.MainScene.children[ i ];
		child.rotation.x += 0.005;
		child.rotation.y += 0.01;
	}
}

init();