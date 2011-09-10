/**
  @author David Piegza

  Implements a simple graph drawing with force-directed placement in 2D and 3D.
  
  It uses the force-directed-layout implemented in:
  https://github.com/davidpiegza/Graph-Visualization/blob/master/layouts/force-directed-layout.js
  
  Drawing is done with Three.js: http://github.com/mrdoob/three.js

  To use this drawing, include the graph-min.js file and create a SimpleGraph object:
  
  <!DOCTYPE html>
  <html>
    <head>
      <title>Graph Visualization</title>
      <script type="text/javascript" src="path/to/graph-min.js"></script>
    </head>
    <body onload="new Drawing.SimpleGraph({layout: '3d', showStats: true, showInfo: true})">
    </bod>
  </html>
  
  Parameters:
  options = {
    layout: "2d" or "3d"

    showStats: <bool>, displays FPS box
    showInfo: <bool>, displays some info on the graph and layout
              The info box is created as <div id="graph-info">, it must be
              styled and positioned with CSS.


    selection: <bool>, enables selection of nodes on mouse over (it displays some info
               when the showInfo flag is set)


    limit: <int>, maximum number of nodes
    
    numNodes: <int> - sets the number of nodes to create.
    numEdges: <int> - sets the maximum number of edges for a node. A node will have 
              1 to numEdges edges, this is set randomly.
  }
  

  Feel free to contribute a new drawing!

 */
 
var Drawing = Drawing || {};

Drawing.SimpleGraph = function(options) {
  var options = options || {};
  
  this.layout = options.layout || "2d";
  this.show_stats = options.showStats || false;
  this.show_info = options.showInfo || false;
  this.selection = options.selection || false;
  this.limit = options.limit || 10;
  this.nodes_count = options.numNodes || 20;
  this.edges_count = options.numEdges || 10;

  var camera, scene, renderer, interaction, geometry, object_selection;
  var stats;
  var info_text = {};
  var graph = new Graph({limit: options.limit});
  
  var geometries = [];
  
  var that=this;

  init();
  createGraph();
  animate();

  function init() {
    // Three.js initialization
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    
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
      
      domElement: renderer.domElement,

      keys: [ 65, 83, 68 ]
    });
    camera.position.z = 5000;

    scene = new THREE.Scene();

    // Node geometry
    if(that.layout === "3d") {
      geometry = new THREE.SphereGeometry( 50, 50, 50 );
    } else {
      geometry = new THREE.SphereGeometry( 50, 50, 0 );
    }
    
    if(that.selection) {
      object_selection = new THREE.ObjectSelection({
        domElement: renderer.domElement,
        selected: function(obj) {
          // display info
          if(obj != null) {
            info_text.select = "Object " + obj.id;
          } else {
            delete info_text.select;
          }
          
        }
      });
    }

    document.body.appendChild( renderer.domElement );
  
    // Stats.js
    if(that.show_stats) {
      stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.top = '0px';
      document.body.appendChild( stats.domElement );
    }

    if(that.show_info) {
      var info = document.createElement("div");
      var id_attr = document.createAttribute("id");
      id_attr.nodeValue = "graph-info";
      info.setAttributeNode(id_attr);
      document.body.appendChild( info );
    }
  }
  
  function createGraph() {
    var node = new Node(0);
    graph.addNode(node);
    drawNode(node);

    var nodes = [];
    nodes.push(node);

    var steps = 1;
    while(nodes.length != 0 && steps < that.nodes_count) {
      var node = nodes.shift();

      var numEdges = randomFromTo(1, that.edges_count);
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
    } 
  
    graph.layout = new Layout.ForceDirected(graph, {width: 2000, height: 2000, iterations: 1000, layout: that.layout});
    graph.layout.init();
    info_text.nodes = "Nodes " + graph.nodes.length;
    info_text.edges = "Edges " + graph.edges.length;
  }



  function drawNode(node) {

    var draw_object = new THREE.Mesh( geometry, [ new THREE.MeshBasicMaterial( {  color: Math.random() * 0xffffff, opacity: 0.5 } ) ] );


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
    
    if(that.layout === "3d") {
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
      var tmp_geo = new THREE.Geometry();
    
      tmp_geo.vertices.push(new THREE.Vertex(source.data.draw_object.position));
      tmp_geo.vertices.push(new THREE.Vertex(target.data.draw_object.position));

      line = new THREE.Line( tmp_geo, material, THREE.LinePieces );
      line.scale.x = line.scale.y = line.scale.z = 1;
      line.originalScale = 1;
      
      geometries.push(tmp_geo);
      
      scene.addObject( line );
  }


  function animate() {
    requestAnimationFrame( animate );
    render();
    if(that.show_info) {
      printInfo();
    }
  }


  function render() {
    if(!graph.layout.finished) {
      info_text.calc = "Calculating layout...";
      graph.layout.generate();
    } else {
      info_text.calc = "";
    }

    for(var i=0; i<geometries.length; i++) {
      geometries[i].__dirtyVertices = true;
    }
    

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

    if(that.selection) {
      object_selection.render(scene, camera);
    }
    // interaction.update();
    if(that.show_stats) {
      stats.update();
    }
    renderer.render( scene, camera );
  }
  
  function printInfo(text) {
    var str = '';
    for(var index in info_text) {
      if(str != '' && info_text[index] != '') {
        str += " - ";
      }
      str += info_text[index];
    }
    document.getElementById("graph-info").innerHTML = str;
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
  
  this.stop_calculating = function() {
    graph.layout.stop_calculating();
  }
}