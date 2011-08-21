
function start() {
  init();
  createGraph();
  animate();
}

var camera, scene, renderer, interaction, stats;
var graph = new Graph();
var graph_layout;


function init() {
  // Three.js initialization
  camera = new THREE.Camera( 75, window.innerWidth / window.innerHeight, 1, 1000000 );
  camera.position.z = 5000;
  camera.useTarget = false;

  scene = new THREE.Scene();

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  interaction = new THREEJS.Interaction(camera);

  document.body.appendChild( renderer.domElement );
  
  // Stats.js
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  document.body.appendChild( stats.domElement );
}


function createGraph() {
  var node = new Node(0);
  graph.addNode(node);
  drawNode(node);

  var nodes = [];
  nodes.push(node);
  
  var steps = 1;
  do {
    var node = nodes.shift();

    var numEdges = randomFromTo(1, 10);
    for(var i=1; i <= numEdges; i++) {
      var target_node = new Node(i*steps);
      if(graph.addNode(target_node)) {
        drawNode(target_node);
        nodes.push(target_node);
        if(graph.addEdge(node, target_node)) {
          drawEdge(node, target_node);
        }
      }
    }
    steps++;
  } while(nodes.length != 0 && steps < 50);
  
  graph_layout = new Layout.ForceDirected(graph, {width: 2000, height: 2000, iterations: 100000});
  graph_layout.init();
}


function drawNode(node) {
  var geometry = new THREE.CubeGeometry( 100, 100, 0 );

  var draw_object = new THREE.Mesh( geometry, [ new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, opacity: 0.5 } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ] );

  var area = 2000;
  if(node.id == 0) {
    draw_object.position.x = 0;
    draw_object.position.y = 0;
  } else {
    draw_object.position.x = Math.floor(Math.random() * (area + area + 1) - area);
    draw_object.position.y = Math.floor(Math.random() * (area + area + 1) - area);
  }

  draw_object.id = node.id;
  node.data.draw_object = draw_object;
  node.position = draw_object.position;
  scene.addObject( node.data.draw_object );
}


function drawEdge(source, target) {
    material = new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 1, linewidth: 1 } );
    tmp_geo = new THREE.Geometry();
    
    tmp_geo.vertices.push(new THREE.Vertex(source.data.draw_object.position));
    tmp_geo.vertices.push(new THREE.Vertex(target.data.draw_object.position));

    line = new THREE.Line( tmp_geo, material, THREE.LinePieces );
    line.scale.x = line.scale.y = line.scale.z = 1;
    line.originalScale = 1;
    scene.addObject( line );
}


function animate() {
  requestAnimationFrame( animate );
  render();
}


function render() {
  graph_layout.generate();
  renderer.render( scene, camera );
  interaction.update();
  stats.update();
}


function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}
