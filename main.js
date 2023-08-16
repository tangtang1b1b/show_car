const room = document.querySelector('.room');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
renderer.setSize(Math.min(window.innerWidth, window.innerHeight), Math.min(window.innerWidth, window.innerHeight));
renderer.setClearColor(0xffffff, 1);
room.appendChild( renderer.domElement );

camera.position.z = 20;
camera.position.y = 3;

let touchX = 0,touchY = 0;

window.addEventListener('touchstart', handleTouchStart, false);
window.addEventListener('touchmove', handleTouchMove, false);
window.addEventListener('mousedown', mouseDown);

function mouseDown(e){
  touchX = e.pageX;
  touchY = e.pageY;
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('mouseup', mouseUp);
}
function mouseMove(e){
  let moveX = e.pageX - touchX;
  let moveY = e.pageY - touchY;
  touchX = e.pageX;
  touchY = e.pageY;
  scene.rotation.x += moveY * 0.003;
  scene.rotation.y += moveX * 0.003;
}
function mouseUp(e){
  window.removeEventListener('mousemove', mouseMove)
}
function handleTouchStart(event) {
  touchX = event.touches[0].clientX;
  touchY = event.touches[0].clientY;
}
function handleTouchMove(event) {
  let moveX = event.touches[0].clientX - touchX;
  let moveY = event.touches[0].clientY - touchY;
  touchX = event.touches[0].clientX;
  touchY = event.touches[0].clientY;
  scene.rotation.y += moveX * 0.003;//乘以0.003因為弧度太大會導致旋轉過快
  scene.rotation.x += moveY * 0.003;
}

// 模型導入
const loader = new THREE.GLTFLoader();
let child;
loader.load( 'model/benz.glb', function ( gltf ) {
	scene.add( gltf.scene );

  const skyColor = 0xffffff; 
  const groundColor = 0xffffff; 
  const intensity = 2;
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  scene.add(light);
  const color = 0xffffff;
  const intensitytwo = 1;
  const lighttwo = new THREE.DirectionalLight(color, intensitytwo);
  lighttwo.position.set(20, 20, 0);
  lighttwo.target.position.set(-5, 0, 0)
  scene.add(lighttwo);
  scene.add(lighttwo.target);
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      if (node.material instanceof THREE.MeshStandardMaterial) {
        node.material.metalness = 0.6; 
        node.material.roughness = 0;
        node.material.transparent = true;
      }
    }
  });
}, undefined, function ( error ) {

	console.error( error );

} );

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();