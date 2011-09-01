
var Drawing = Drawing || {};

Drawing.SimpleGraph = function(options) {
  var options = options || {};
  var layout = options.layout || "2d";

  var camera, scene, renderer, interaction, stats;
  var graph = new Graph({limit: options.limit});

  init();
  createGraph();
  animate();

  function init() {
    // Three.js initialization
    camera = new THREE.TrackballCamera({
      fov: 40, 
      aspect: window.innerWidth / window.innerHeight,
      near: 1,
      far: 1000000,

      rotateSpeed: 0.5,
      zoomSpeed: 5.2,
      panSpeed: 1,

      noZoom: false,
      noPan: false,

      staticMoving: false,
      dynamicDampingFactor: 0.3,

      keys: [ 65, 83, 68 ]
    });
    camera.position.z = 5000;

    scene = new THREE.Scene();

    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );
  
    // Stats.js
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild( stats.domElement );
  
    // info = document.getElementById("info");
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
    } while(nodes.length != 0 && steps < 150);
  
    if(layout === "3d") {
      graph.layout = new Layout.ForceDirected3D(graph, {width: 2000, height: 2000, iterations: 2000});
    } else {
      graph.layout = new Layout.ForceDirected(graph, {width: 2000, height: 2000, iterations: 2000});
    }
    graph.layout.init();
  }



  function drawNode(node) {
    var geometry;
    if(layout === "3d") {
      geometry = new THREE.CubeGeometry( 50, 50, 50 );
    } else {
      geometry = new THREE.CubeGeometry( 50, 50, 0 );
    }
    var draw_object = new THREE.Mesh( geometry, [ new THREE.MeshBasicMaterial( {  color: Math.random() * 0xffffff } ), new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, wireframe: true } ) ] );

    // label
    // var labelCanvas = document.createElement( "canvas" );
    // var xc = labelCanvas.getContext("2d");
    // labelCanvas.width = labelCanvas.height = 128;
    // // xc.shadowColor = "#000";
    // // xc.shadowBlur = 7;
    // // xc.fillStyle = "orange";
    // xc.font = "50pt arial bold";
    // xc.fillText("myText", 10, 64);
    // 
    // var xm = new THREE.MeshBasicMaterial( { map: new THREE.Texture( labelCanvas ), transparent: true } );
    // xm.map.needsUpdate = true;

    var area = 2000;
    draw_object.position.x = Math.floor(Math.random() * (area + area + 1) - area);
    draw_object.position.y = Math.floor(Math.random() * (area + area + 1) - area);
    
    if(layout === "3d") {
      draw_object.position.z = Math.floor(Math.random() * (area + area + 1) - area);
    }

    // var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), xm );
    // mesh.position.x = draw_object.position.x;
    // mesh.position.y = draw_object.position.y;
    // mesh.doubleSided = true;
    // mesh.draw_object = draw_object;
    // mesh.updateMatrix();
    // mesh.type = "label";
    // scene.addObject(mesh);

    draw_object.id = node.id;
    node.data.draw_object = draw_object;
    node.position = draw_object.position;
    scene.addObject( node.data.draw_object );
  }


  function drawEdge(source, target) {
      material = new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 1, linewidth: 0.5 } );
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
    graph.layout.generate();
  
    // scene.objects.forEach(function(obj) {
    //   if(obj.type === "label") {
    //     var delta_x = obj.position.x - obj.draw_object.position.x;
    //     var delta_y = obj.position.y - obj.draw_object.position.y;
    //     if(Math.sqrt(delta_x*delta_x) > 300) {
    //       obj.position.x = obj.draw_object.position.x;
    //     }
    //     if(Math.sqrt(delta_y*delta_y) > 300) {
    //       obj.position.y = obj.draw_object.position.y;
    //     }
    //     drawText(obj, obj.draw_object.position.y);
    //   }
    // });
  
    renderer.render( scene, camera );
    // interaction.update();
    stats.update();
  }


  function drawText(draw_object, text) {
    draw_object.materials[0].map.image = null;
    var textCanvas = document.createElement( "canvas" );
    var xc = textCanvas.getContext("2d");
    // xc.shadowColor = "#000";
    // xc.shadowBlur = 7;
    xc.font = "50pt arial bold";
    xc.fillText(text, 10, 64);
    draw_object.materials[0].map.image = textCanvas;
  }


  function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

}