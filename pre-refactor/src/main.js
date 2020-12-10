import * as THREE from '../../vendor/three/build/three.module.js'
var spritesDir = '../assets/sprites/'
var yellowFlapArr = ["yellowbird-downflap.png", "yellowbird-midflap.png","yellowbird-upflap.png", "yellowbird-midflap.png"];
var pipesArr = [ "pipe-green - middle - low.png", "pipe-green - middle-high.png", "pipe-green-high.png", "pipe-green-low.png" ];
//if they're above or below the miny and maxy
var tunnelHeightArr = [[-8.55, 41.45],[8.55, 58.55],[-23.905, 26.095],[23.905,73.905]]

var projecting = false;
var modX = 0;
var widthDependancy = 4  ;
//references the Div holding the scene
const container = document.querySelector('#scene-container');

//create a Scene
const scene = new THREE.Scene(); 
scene.background = new THREE.Color(0xff0000);
//Set the background color
const background = new THREE.TextureLoader().load( "../assets/sprites/background-day.png" )
background.wrapS = THREE.RepeatWrapping;
background.wrapT = THREE.RepeatWrapping;
background.repeat.set( widthDependancy, 1 );
scene.background = background;

//Create a camera 
const camera = new THREE.PerspectiveCamera(75, widthDependancy*288 / 512, 0.1, 1000)
//Move the camera back so we can view the scene
camera.position.set(modX,0,10);

// create the renderer
const renderer = new THREE.WebGLRenderer({alpha: true});

renderer.setSize(widthDependancy*288, 512);
//document.body.appendChild(renderer.domElement);
container.append(renderer.domElement);

var clock = new THREE.Clock();
var waitTime = 0;

var j = 0;
var i = 0;
while( j < 100){
    
    if(i == 3)
    {
        i = 0;
    }
    var pipeFilePath = spritesDir + pipesArr[i];
    var currTunnel = tunnelHeightArr[i];
    j++;
    PopulatePipeSprit(pipeFilePath, currTunnel, j);
    i++;
}



var groupOfFlappers = new THREE.Group();
var i;
for(i = 0; i < yellowFlapArr.length; i++){
    var sprite = PopulateBirdSprite (spritesDir + yellowFlapArr[i])
    if(i == 1 || i == 2 || i == 3){
        sprite.visible = false;
        groupOfFlappers.add(sprite);
        continue;
    }
    groupOfFlappers.add(sprite);
}
scene.add(groupOfFlappers);

i = 0;


    

function Update() {
    waitTime += clock.getDelta() * 1000;
    if(waitTime > 20)
    {
        UpdatePosition()
        Projecting();
        Scroll();
        waitTime = 0;
        i ++;
        j += 2;
        if( i == 3)
            i = 0;
        
        switch(i) {
            case 0:
                groupOfFlappers.children[0].visible = true;
                groupOfFlappers.children[1].visible = false;
                break;
            case 1:
                groupOfFlappers.children[0].visible = false;
                groupOfFlappers.children[1].visible = true;
                break;
            case 2:
                groupOfFlappers.children[1].visible = false;
                groupOfFlappers.children[2].visible = true;
                break;
            case 3:
                groupOfFlappers.children[2].visible = false;
                groupOfFlappers.children[3].visible = true;
                break;
    
        }
    }
}



var initialPosition = groupOfFlappers.position.y;
var endPosition = 3*widthDependancy;
function Projecting(){
    if(endPosition == initialPosition){
        projecting = false;
        hitMaxHeight = false;
        endPosition = 3*widthDependancy;
    }
}
function BirdIsInThePipe(){ 
    //gets the birds location
    //gets the maxY and minY of the next pipe
    //xStart is always at %50 and ends at xStart + 52
}
var j = 0;
var modZ = 0;
var hitMaxHeight = false;
function UpdatePosition(){
    var x;
    var modY;
    var maxModZ;
    var shift;
    if( projecting == false && hitMaxHeight == false){
        modY =  1.8 * (widthDependancy / 4);
        maxModZ = -1;
        shift = -0.2 ;
        if(modZ > maxModZ)
            modZ += shift;
    }
    else {
        if (groupOfFlappers.position.y >= endPosition || hitMaxHeight == true){
            maxModZ = 0;
            modY = 0;
            shift = 0.3;
            if(modZ >= maxModZ){
                modY = -.2 * (widthDependancy / 4);
                modZ -= shift;
                projecting = false;
                hitMaxHeight = true;
            }
            else {
                endPosition = initialPosition;
                hitMaxHeight = false;
            }
        }
        else {
            modY = -( 1.6 * (widthDependancy / 4) );
            maxModZ = 1.0;
            shift = 0.25;
            if(modZ < maxModZ) {
                modZ += shift;
            }
        }
        
    }
    
    initialPosition = groupOfFlappers.position.y - modY;
    groupOfFlappers.position.set( modX, initialPosition, 0 );
    for( x = 0; x < groupOfFlappers.children.length; x++ ){
        var child = groupOfFlappers.children[x];
        child.rotation.z = modZ;
    }
}

function PopulatePipeSprit(filePath, tunnelHeight, segment) {
    var spriteMap = new THREE.TextureLoader().load( filePath );
    var spriteMaterial = new THREE.MeshBasicMaterial ( { map: spriteMap, transparent: true } );
    var geometry = new THREE.PlaneGeometry( 52, 512 );

    sprite = new THREE.Mesh( geometry, spriteMaterial );
    sprite.position.set( segment*50, 0, 0 );
    sprite.scale.set( .15, .15, 1 );
    scene.add( sprite );

    var tunnelMaterial = new THREE.MeshBasicMaterial( { color: 0xffff60, transparent: false } );
    geometry = new THREE.PlaneGeometry( 52 , 50  );
    var tunnel = new THREE.Mesh( geometry, tunnelMaterial );
    tunnel.scale.set( .15, .15   , 1 );
    tunnel.position.set(segment*50, tunnelHeight[0], 0 );
    scene.add( tunnel );
}

function PopulateBirdSprite(filePath) {
    var spriteMap = new THREE.TextureLoader().load( filePath );

    var spriteMaterial = new THREE.MeshBasicMaterial ( { map: spriteMap, transparent: true } );
    var geometry = new THREE.CircleGeometry(1, 30,);
    sprite = new THREE.Mesh( geometry, spriteMaterial );
    sprite.position.set( 0, 0, 0 );
    sprite.scale.set( 34 / (widthDependancy*4) ,24 / (widthDependancy*4) , 1 );

    return sprite;
}

function Scroll(){
    modX += 1.5;
    camera.position.set(modX,0,50);
}


function Listening(){
    document.addEventListener( 'keydown',function(e) {``
        if( e.key == ' ' && projecting == false && hitMaxHeight == false){
            endPosition += initialPosition;
            projecting = true;
            hitMaxHeight = false;
        }
        if( e.key=='Escape' ) {
            if(!clock.running)
            {
                clock.start();
            }
            else {
                clock.stop();
            }
        }
    })
}

function animate() {
    requestAnimationFrame( animate );
    Update();
    //var target = new THREE.Vector3();
    //groupOfFlappers.getWorldPosition(target)
    console.log(scene.children);
    renderer.render( scene, camera );
}
animate();
Listening();