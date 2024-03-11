//mandatory start code (rn I have orbit, first person, and pointer lock controls in here. some of this should probably go )//ok i don't think I like pointer lock 
//closed sections are "done' "
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
// import { FirstPersonControls } from "three/examples/jsm/Addons.js";

import { CSS2DRenderer,CSS2DObject } from "three/examples/jsm/Addons.js";
import { debounce, xor} from 'lodash'
//make a scene 
const scene = new THREE.Scene();
//add fog 
scene.fog = new THREE.Fog(0x4f5052, 0.0025, 150); 


//setup a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xefface);
document.body.appendChild(renderer.domElement);

//setup camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.x = -20;
camera.position.z = 40;
camera.position.y = 10; 

//it's unclear to me what the followign text is doing at the moment but i clearly need it for something 
//label renderer video https://www.youtube.com/watch?v=0ZW3xrFhY3w OH MY GOD IT WORKS HA. did up to 4:00 minutes before transformations. //hm ok i'm not sure which text videos i need...
const labelRenderer= new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top='0px';
labelRenderer.domElement.style.pointerEvents = 'none'; 
document.body.appendChild(labelRenderer.domElement);

//welcome to texture import land! 

//import floor texture 
const floorLoader = new THREE.TextureLoader(); 
const floorTexture = floorLoader.load ('/realFloor.png') 
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
floorMaterial.map = floorTexture
//bump map for floor 
const floorBump = new THREE.TextureLoader().load('/trueBump.png')
floorMaterial.bumpMap = floorBump//ok have them walk through the back wall just fully through it into the new world. 

//roof texture 
const roofTexture = new THREE.TextureLoader().load('/starsky.png')
const roofMaterial = new THREE.MeshPhongMaterial({ color:
0xffffff})
roofMaterial.map = roofTexture
roofTexture.wrapS = THREE.RepeatWrapping; // horizontal wrapping
roofTexture.wrapT = THREE.RepeatWrapping; // vertical wrapping
roofTexture.repeat.set( 2,2); // how many times to repeat
//side wall texture  
const sideLoader = new THREE.TextureLoader(); 
const sideTexture = sideLoader.load ('/sideWall.png') // make sure this file exists!

const sideMaterial = new THREE.MeshPhongMaterial({ color: 
  0xffffff })
sideMaterial.map = sideTexture
// echinacea texture  

const echinaceaTexture = new THREE.TextureLoader().load('/echinacea.png') 
const echinaceaMat = new THREE.MeshPhongMaterial({color:0xffffff})
echinaceaMat.map = echinaceaTexture

//rhubarb texture
const rhubarbTexture = new THREE.TextureLoader().load('/new_rhubarb.png')
const rhubarbMat = new THREE.MeshPhongMaterial({color:0xffffff})
rhubarbMat.map = rhubarbTexture

//periwinkle texture
const periwinkleTexture = new THREE.TextureLoader().load('/periwinkle.png')
const periwinkleMat = new THREE.MeshPhongMaterial({color:0xffffff})
periwinkleMat.map = periwinkleTexture

//white decoy flower
const wfTexture = new THREE.TextureLoader().load('/white_flower.png')
const wfMat = new THREE.MeshPhongMaterial({color:0xffffff})
wfMat.map = wfTexture
//ADD MORE DECOYS  YEAH 
//kale decoy
const kaleTexture = new THREE.TextureLoader().load('/kale.png')
const kaleMat = new THREE.MeshPhongMaterial({color:0xffffff})
kaleMat.map = kaleTexture
//yellow decoy flower
const yellow_flowerTexture = new THREE.TextureLoader().load('/yellow_flowers.png')
const yellow_flowerMat = new THREE.MeshPhongMaterial({color:0xffffff})
yellow_flowerMat.map = yellow_flowerTexture

//back wall with house texture  
const backLoader = new THREE.TextureLoader();
const backTexture = backLoader.load('/fairyTexture.png')
const backMaterial = new THREE.MeshPhongMaterial({ color: 
    0xffffff })
backMaterial.map = backTexture

//make a raycaster?
const raycaster = new THREE.Raycaster();

// make a mouse
const mouse = new THREE.Vector2();
function onMouseMove (event){
  mouse.x= (event.clientX / window.innerWidth)*2-1;
  mouse.y=-(event.clientY / window.innerHeight)*2+1;

}
window.addEventListener("mousemove",onMouseMove,false)


//add lights DO MORE LIGHTS PLEASE SASHA 
scene.add(new THREE.AmbientLight(0xffffff));
const dirLight = new THREE.DirectionalLight(0xaaaaaa); //come back to these colors later! !!
dirLight.position.set(5, 12, 8);
dirLight.castShadow = true;
dirLight.intensity = 1;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.mapSize.width = 512;
dirLight.shadow.mapSize.height = 512;
dirLight.shadow.radius = 4;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);


//adding stuff to the scene
//adding video
let video = document.getElementById("bowie");
let videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter  = THREE.LinearFilter;
var bowieMat = new THREE.MeshBasicMaterial({
  map: videoTexture,
  side: THREE.FrontSide,
  toneMapped: false,

});

let bowieGeo = new THREE.PlaneGeometry(160,90);
let bowieMesh = new THREE.Mesh (bowieGeo,bowieMat);
bowieMesh.position.set(0,-10,-40);
// scene.add(bowieMesh)

//adding echinacea 
const Flowers = new THREE.Group()
const echinacea = new THREE.Group()
echinaceaMat.side = THREE.DoubleSide
const Echinacea = new THREE.PlaneGeometry(5, 5);
const echinaceaMesh = new THREE.Mesh(Echinacea, echinaceaMat);
echinaceaMesh.position.set(35,2,10);
echinaceaMesh.rotation.set(0,  Math.PI/2,0);
echinaceaMesh.receiveShadow = true;
echinacea.add(echinaceaMesh)
scene.add(echinacea)

//adding rhubarb
const rhubarb = new THREE.Group()
rhubarbMat.side = THREE.DoubleSide
const Rhubarb = new THREE.PlaneGeometry(7, 8);
const rhubarbMesh = new THREE.Mesh(Rhubarb, rhubarbMat);
rhubarbMesh.position.set(-25,2,-18);
rhubarbMesh.rotation.set(0,  Math.PI/4,0);
rhubarbMesh.receiveShadow = true;
rhubarb.add(rhubarbMesh)
scene.add(rhubarb)
//kale to hide the rhubarb
const kale1geo = new THREE.PlaneGeometry(7,7);
const kale1mesh = new THREE.Mesh(kale1geo, kaleMat);
kale1mesh.position.set(-20,3,-20);
kale1mesh.rotation.set(0,Math.PI/4,0);
scene.add(kale1mesh)
const kale2geo = new THREE.PlaneGeometry(8,12);
const kale2mesh = new THREE.Mesh(kale2geo, kaleMat);
kale2mesh.position.set(-30,3,-20);
kale2mesh.rotation.set(0,Math.PI/4,0);
scene.add(kale2mesh)

//adding periwinkle
const periwinkle = new THREE.Group()
periwinkleMat.side = THREE.DoubleSide
const Periwinkle = new THREE.PlaneGeometry(5, 5);
const periwinkleMesh = new THREE.Mesh(Periwinkle, periwinkleMat);
periwinkleMesh.position.set(37,2,-2);
periwinkleMesh.rotation.set(0,  Math.PI/2,0);
periwinkleMesh.receiveShadow = true;
periwinkle.add(periwinkleMesh)
scene.add(periwinkle)


kaleMat.side = THREE.DoubleSide
yellow_flowerMat.side = THREE.DoubleSide
//adding things to pick the echinacea out of 
const block1mat = new THREE.MeshPhongMaterial({color:0xbaff1e });
block1mat.side = THREE.DoubleSide
const block1geo = new THREE.PlaneGeometry(5, 5);
const block1mesh = new THREE.Mesh(block1geo, wfMat);
block1mesh.position.set(32,5,13);
block1mesh.rotation.set(0, Math.PI/2, 0);
block1mesh.receiveShadow = true;
Flowers.add(block1mesh)

const block2mat = new THREE.MeshPhongMaterial({color:0xfacade });
wfMat.side = THREE.DoubleSide
const block2geo = new THREE.PlaneGeometry(5, 5);
const block2mesh = new THREE.Mesh(block2geo, yellow_flowerMat);
block2mesh.position.set(32,3,5); //x is towards viewer, y is up down, z is left right 
block2mesh.rotation.set(0, Math.PI/2, 0);
block2mesh.receiveShadow = true;
Flowers.add(block2mesh)

const block3geo = new THREE.PlaneGeometry(5,5);
const block3mesh = new THREE.Mesh(block3geo,wfMat);
block3mesh.position.set(32.5,6,8);
block3mesh.rotation.set(0, Math.PI/2, 0);
block3mesh.receiveShadow = true;
Flowers.add(block3mesh)



scene.add(Flowers);




//adding rocks for the salt or something
const Rocks = new THREE.Group()
const rockTexture = new THREE.TextureLoader().load('/rock.png')
const rockMat = new THREE.MeshPhongMaterial({color:0xffffff})
rockMat.map = rockTexture
rockMat.side = THREE.DoubleSide

const rock1geo =  new THREE.PlaneGeometry(5, 5);
const rock1mesh = new THREE.Mesh(rock1geo,rockMat);
rock1mesh.rotation.set(0, Math.PI/2, 0);
rock1mesh.position.set(-31,3,15);
Rocks.add(rock1mesh)

const rock2geo = new THREE.PlaneGeometry (10,10);
const rock2mesh = new THREE.Mesh(rock2geo, rockMat);
rock2mesh.rotation.set(0,Math.PI/2,0);
rock2mesh.position.set(-29,3,4);
Rocks.add(rock2mesh)

//adding a crystal  (AMETHYST) to pick out of the rocks (not salt, I LIED)
const amethyst = new THREE.Group()
const crystalTexture = new THREE.TextureLoader().load('/crystal.png')
const crystalMat = new THREE.MeshPhongMaterial({color:0xffffff})
crystalMat.map = crystalTexture
crystalMat.side = THREE.DoubleSide

const crystalGeo = new THREE.PlaneGeometry(5,5);
const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
crystalMesh.rotation.set(0,Math.PI/2,0);
crystalMesh.position.set(-30,3,12);
amethyst.add(crystalMesh)
scene.add(amethyst)


scene.add(Rocks)
//create ground plane
floorMaterial.side = THREE.DoubleSide
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMesh = new THREE.Mesh(groundGeometry, floorMaterial);
groundMesh.position.set(0, -2, 0);
groundMesh.rotation.set(Math.PI / -2, 0, 0);
groundMesh.receiveShadow = true;
scene.add(groundMesh);


//create another side plane
sideMaterial.side = THREE.DoubleSide

const rightGeometry = new THREE.PlaneGeometry(100, 100);
const rightMesh = new THREE.Mesh(rightGeometry, sideMaterial);
rightMesh.position.set(40, 30, 0);
rightMesh.rotation.set(Math.PI / -2, Math.PI / -2, 3*(Math.PI / 2));
rightMesh.receiveShadow = true;
scene.add(rightMesh);

//side walls
//if looking at back wall, x slides to left, y slides up, z slides front and back 
const leftGeometry = new THREE.PlaneGeometry(100,100);
const leftMesh = new THREE.Mesh(leftGeometry,sideMaterial);
leftMesh.position.set(-40,30,0);
leftMesh.rotation.set(Math.PI / -2, Math.PI / -2, 3*(Math.PI / 2));
leftMesh.receiveShadow = true;
scene.add(leftMesh);



//hidden back wall behind user
const closedGeo = new THREE.PlaneGeometry(100,100);
const closedMesh = new THREE.Mesh(closedGeo,roofMaterial);
closedMesh.position.set(0,30,50);
closedMesh.rotation.set(0, 0,0);
closedMesh.receiveShadow = true;
scene.add(closedMesh);

//back wall
backMaterial.side = THREE.DoubleSide
const backGeometry = new THREE.PlaneGeometry(100,100);
const backMesh = new THREE.Mesh(backGeometry,backMaterial);
backMesh.position.set(0,30,-50)
backMesh.rotation.set(0,0,0);
backMesh.receiveShadow = true;
scene.add(backMesh);

//roof
roofMaterial.side = THREE.DoubleSide
const roofGeometry = new THREE.PlaneGeometry(200,200);
const roofMesh = new THREE.Mesh(roofGeometry,roofMaterial);
roofMesh.position.set(0,80,-50)
roofMesh.rotation.set(80,0,0);
roofMesh.receiveShadow = true;
scene.add(roofMesh);

const endGeometry = new THREE.PlaneGeometry(1000,1000);
const endMesh = new THREE.Mesh(endGeometry, roofMaterial);
endMesh.position.set (0,30,-50)


// add orbitcontrols
const controller = new OrbitControls(camera, renderer.domElement);
controller.enableDamping = true;
controller.dampingFactor = 0.05;
controller.minDistance = 3;
controller.maxDistance = 100;
controller.minPolarAngle = Math.PI / 4;
controller.maxPolarAngle = (3 * Math.PI) / 4;


//add something to the effect of once flower has been collected and crystal has been collected, move on
//first create the fairy ring

const ringTexture = new THREE.TextureLoader().load('/fairy-ring.png')
const ringMat = new THREE.MeshPhongMaterial({color:0xaaaaaa})
ringMat.map = ringTexture
ringMat.side = THREE.DoubleSide

// const ringGeo = new THREE.CylinderGeometry(5,5,20,32);


const ringGeo = new THREE.PlaneGeometry(30,30); 
const ringMesh = new THREE.Mesh(ringGeo,ringMat);
ringMesh.position.set(-10,5,-20)
// scene.add(ringMesh)
//press enter to close intro dialog //ok it's press button not press enter but still

const intro_button = document.getElementById("intro_close");
const echinacea_instructions = document.getElementById("find-Echinacea");
const amethyst_instructions = document.getElementById("found-Echinacea");
const periwinkle_instructions = document.getElementById("found-Amethyst");
const rhubarb_instructions = document.getElementById("found-Periwinkle");
const next_step = document.getElementById("found-Rhubarb");
const endgame = document.getElementById ("endgame")

const intro_text = document.getElementById("intro");
intro_button.addEventListener("click", event =>{
  intro_text.style.display = "none"
  echinacea_instructions.style.display = "block"
  intro_button.style.display = "none"

  
});

const listener = new THREE.AudioListener();
camera.add(listener);
const audioLoader = new THREE.AudioLoader();
const JandW = new THREE.Audio(listener);
audioLoader.load('/jandwreal.mp3',function(buffer){
  JandW.setBuffer(buffer);
  JandW.setLoop(true);
  JandW.setVolume(0.5);


});

paris.addEventListener("click", event=>{

  new_form.style.display = "none";
  next_step.style.display = "none";
  echinacea_instructions.style.display = "none";
  amethyst_instructions.style.display = "none";
  periwinkle_instructions.style.display = "none";
  rhubarb_instructions.style.display = "none";
  endgame.style.display = "block";
  paris.style.display = "none"
  scene.remove(periwinkle)
  scene.remove(amethyst)
  scene.remove(echinacea)
  scene.remove(Flowers)
  scene.remove(Rocks)
  scene.remove(rhubarb)
  scene.remove(kale1mesh)
  scene.remove(kale2mesh)
  scene.remove(roofMesh)
  scene.remove(closedMesh)
  scene.remove(backMesh)
  scene.remove(leftMesh)
  scene.remove(rightMesh)
  scene.remove(groundMesh)
  scene.add(endMesh)
  scene.add(bowieMesh);
  scene.fog = new THREE.Fog(0x4f5052, 0.0025, 0); 
  JandW.play()

})

const findEchinacea = debounce(()=>{var x = document.getElementById("find-Echinacea");  //add some wait time to this debounce still 
if (x.style.display === "none") {
  x.style.display = "block";
} else {
  x.style.display = "none";
}})

const foundEchinacea = debounce(()=>{var x = document.getElementById("found-Echinacea"); 
if (x.style.display === "none") {
  x.style.display = "block";
  echinacea_instructions.style.display = "none"
} else {
  x.style.display = "none";
}})

const foundRing = debounce(()=>{var x = document.getElementById("riddle"); 
if (x.style.display === "none") {
  x.style.display = "block";
} else {
  x.style.display = "none";
}}) 


const new_form = document.getElementById("new_form")




/////////trying flashlight

// const lightTarget = new THREE.Mesh(
//   new THREE.BoxGeometry(1,1,1),
//   new THREE.MeshPhongMaterial({color:0xdecade})

// );
// lightTarget.position.set(0,0,-3);


// const spotlight = new THREE.Mesh(
//   new THREE.SphereGeometry(1),
//   new THREE.MeshPhongMaterial({transparent:true,color:0xffff00, opacity:0.4})
// );
// spotlight.position.set(0,0,0);

// // const controls = new PointerLockControls(camera,document.body); //turn off pointerlock controls :( :( :( go back to first person bu
// window.addEventListener('click',function(){controls.lock();});


// const cameraPlayer = new THREE.Mesh(
//   new THREE.BoxGeometry(1,1,1),
//   new THREE.MeshPhongMaterial({color:0x0000ff})
// );
// cameraPlayer.position.set(0,0,3);
// cameraPlayer.add(spotlight);
// cameraPlayer.add(lightTarget);
// scene.add(cameraPlayer);

// const spotLight = new THREE.SpotLight(0xffffff,1.0,10,Math.PI*0.1,0,1);
// camera.add(spotLight);
// camera.add(spotLight.target)
// spotLight.target.position.z = -3
// let flashlight = true;
// if (flashlight = true);
//   spotLight.intensity = 1; 


///////////none of this did what I wanted it to do :( came from here: https://www.youtube.com/watch?v=CQxLslU20UI&ab_channel=flanniganable 

renderer.render(scene, camera);
let lastIntersectedFB = undefined
let lastMaterialFB = undefined
let lastIntersectedE = undefined
let lastMaterialE = undefined
let lastIntersectedA = undefined
let lastMaterialA = undefined
let lastMaterialP = undefined
let lastIntersectedP = undefined
let lastMaterialR = undefined
let lastIntersectedR = undefined

let step = 0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse,camera);
  labelRenderer.render(scene,camera);

  const intersectsAmethyst = raycaster.intersectObjects(amethyst.children);
  if (lastMaterialA == undefined){
    if (intersectsAmethyst.length>=1){
      lastIntersectedA = intersectsAmethyst[0].object
      lastMaterialA = intersectsAmethyst[0].object.material.clone()
      intersectsAmethyst[0].object.material.color.set(0xff0000);
      periwinkle_instructions.style.display = "block"
      amethyst_instructions.style.display = "none"
    }
  }
  else{
    if(lastIntersectedA != undefined){
      lastIntersectedA.material.copy(lastMaterialA)
      lastIntersectedA = undefined
      lastMaterialA = undefined
    }
  }
  const intersectsRhubarb = raycaster.intersectObjects(rhubarb.children);
  if (lastMaterialR == undefined){
    if (intersectsRhubarb.length>=1){
      lastIntersectedR = intersectsRhubarb[0].object
      lastMaterialR = intersectsRhubarb[0].object.material.clone()
      intersectsRhubarb[0].object.material.color.set(0xff0000);
      next_step.style.display = "block"
      rhubarb_instructions.style.display = "none"
      new_form.style.display = "block"
      const paris = document.getElementById("paris")
      paris.style.display = "block"
    }
  }
  else{
    if(lastIntersectedR != undefined){
      lastIntersectedR.material.copy(lastMaterialR)
      lastIntersectedR = undefined
      lastMaterialR = undefined
    }
  }
  const intersectsPeriwinkle = raycaster.intersectObjects(periwinkle.children);
  if (lastMaterialP == undefined){
    if (intersectsPeriwinkle.length>=1){
      lastIntersectedP = intersectsPeriwinkle[0].object
      lastMaterialP = intersectsPeriwinkle[0].object.material.clone()
      intersectsPeriwinkle[0].object.material.color.set(0xff0000);
      rhubarb_instructions.style.display = "block"
      periwinkle_instructions.style.display = "none"
      
    }
  }
  else{
    if(lastIntersectedP != undefined){
      lastIntersectedP.material.copy(lastMaterialP)
      lastIntersectedP = undefined
      lastMaterialP = undefined
    }
  }


  const intersectsFlowerBlocks = raycaster.intersectObjects(Flowers.children);
  if (lastMaterialFB == undefined){ //oh my god it WORKS
    if (intersectsFlowerBlocks.length>=1){ //haha this is a list not a length. cry. 
      lastIntersectedFB = intersectsFlowerBlocks[0].object
      lastMaterialFB=intersectsFlowerBlocks[0].object.material.clone()
      console.log(lastMaterialFB)
      
      intersectsFlowerBlocks[0].object.material.color.set(0xff0000); 
      findEchinacea()



    } }
    else {
      if(lastIntersectedFB != undefined){
        console.log(lastMaterialFB)
        lastIntersectedFB.material.copy(lastMaterialFB)
        console.log(lastMaterialFB)
        lastIntersectedFB = undefined
        lastMaterialFB = undefined
        
    }
  }
  const intersectsEchinacea = raycaster.intersectObjects(echinacea.children);
  if (lastMaterialE == undefined){ 
    if (intersectsEchinacea.length>=1){ //haha this is a list not a length. cry. 
      lastIntersectedE = intersectsEchinacea[0].object
      lastMaterialE=intersectsEchinacea[0].object.material.clone()
      console.log(lastMaterialE)
      
      intersectsEchinacea[0].object.material.color.set(0xff0000); 
      foundEchinacea() 


    } }
    else {
      if(lastIntersectedE != undefined){
        console.log(lastMaterialE)
        lastIntersectedE.material.copy(lastMaterialE)
        console.log(lastMaterialE)
        lastIntersectedE = undefined
        lastMaterialE= undefined
    }
  }

    
videoTexture.needsUpdate = true; 
video.play();
controller.update();
}


animate();



