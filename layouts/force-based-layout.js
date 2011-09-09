/**
  @author David Piegza

  Implements a force-directed layout, the algorithm is based on Fruchterman and Reingold and
  the JUNG implementation.

  Needs the following graph data structure:
  https://github.com/davidpiegza/Graph-Visualization/blob/master/Graph.js

  Parameters:
  graph - data structure
  options = {
    layout: "2d" or "3d"
    attraction: <float>, attraction value for force-directed layout
    repulsion: <float>, repulsion value for force-directed layout
    iterations: <int>, maximum number of iterations
    width: <int>, width of the viewport
    height: <int>, height of the viewport

    positionUpdated: <function>, called when the position of the node has been updated
  }
  
  Example:
  
  create:  
  layout = new Layout.ForceDirected(graph, {width: 2000, height: 2000, iterations: 1000, layout: "3d"});
  
  call init when graph is loaded (and for reset or when new nodes has been added to graph):
  layout.init();
  
  call generate in a render method, returns true if it's still calculating and false if it's finished
  layout.generate();


  Feel free to contribute a new layout!

 */

var Layout = Layout || {};

Layout.ForceDirected = function(graph, options) {
  var options = options || {};
  var layout = options.layout || "2d";
  var callback_positionUpdated = options.positionUpdated;
  
  var EPSILON = 0.000001;
  var attraction_multiplier = options.attraction || 5;
  var attraction_constant;
  var repulsion_multiplier = options.repulsion || 0.75;
  var repulsion_constant;
  var forceConstant;
  var layout_iterations = 0;
  var max_iterations = options.iterations || 1000;
  var temperature = 0;
  var graph = graph;
  var width = options.width || 200;
  var height = options.height || 200;
  
  this.finished = false;
  
  this.init = function() {
    this.finished = false;
    temperature = width / 10.0;
    forceConstant = Math.sqrt(height * width / graph.nodes.length);
    attraction_constant = attraction_multiplier * forceConstant;
    repulsion_constant = repulsion_multiplier * forceConstant;
  };
  
  this.generate = function() {
    // TODO: stop if total force reached 0
    if(layout_iterations < max_iterations) {
      graph.nodes.forEach(function(node_v) {
        calcRepulsion(graph, node_v);
      });

      graph.edges.forEach(function(edge) {
        calcAttraction(graph, edge);
      });

      graph.nodes.forEach(function(node_v) {
        calcPositions(graph, node_v);
      });

      // info.innerHTML = "node_force: " + parseInt(node_force) + "<br>edge_force: " + edge_force + "<br>div: " + (node_force-edge_force);

      // temperature *= (1.0 - (layout_iterations / max_iterations));
      layout_iterations++;
    } else {
      this.finished = true;
      return false;
    }
    return true;
  };

  var calcRepulsion = function(graph, node_v) {
    node_v.layout = node_v.layout || {};
    node_v.layout.offset_x = 0;
    node_v.layout.offset_y = 0;
    if(layout === "3d") {
      node_v.layout.offset_z = 0;
    }
    node_v.layout.force = 0;
    node_v.layout.tmp_pos_x = node_v.layout.tmp_pos_x || node_v.position.x;
    node_v.layout.tmp_pos_y = node_v.layout.tmp_pos_y || node_v.position.y;
    if(layout === "3d") {    
      node_v.layout.tmp_pos_z = node_v.layout.tmp_pos_z || node_v.position.z;
    }
  
    graph.nodes.forEach(function(node_u) {
      if(node_v.id != node_u.id) {
        node_u.layout = node_u.layout || {};
        node_u.layout.tmp_pos_x = node_u.layout.tmp_pos_x || node_u.position.x;
        node_u.layout.tmp_pos_y = node_u.layout.tmp_pos_y || node_u.position.y;
        if(layout === "3d") {
          node_u.layout.tmp_pos_z = node_u.layout.tmp_pos_z || node_u.position.z;
        }

        var delta_x = node_v.layout.tmp_pos_x - node_u.layout.tmp_pos_x;
        var delta_y = node_v.layout.tmp_pos_y - node_u.layout.tmp_pos_y;
        if(layout === "3d") {
          var delta_z = node_v.layout.tmp_pos_z - node_u.layout.tmp_pos_z;
        }
      
        var delta_length = Math.max(EPSILON, Math.sqrt((delta_x * delta_x) + (delta_y * delta_y)));
        if(layout === "3d") {
          var delta_length_z = Math.max(EPSILON, Math.sqrt((delta_z * delta_z) + (delta_y * delta_y)));
        }

        var force = (repulsion_constant * repulsion_constant) / delta_length;
        if(layout === "3d") {
          var force_z = (repulsion_constant * repulsion_constant) / delta_length_z;
        }


        node_v.layout.force += force;
        node_u.layout.force += force;
        
        node_v.layout.offset_x += (delta_x / delta_length) * force;
        node_v.layout.offset_y += (delta_y / delta_length) * force;
        if(layout === "3d") {
          node_v.layout.offset_z += (delta_z / delta_length_z) * force_z;
        }
      }
    });
  };

  var calcAttraction = function(graph, edge) {
    // var delta_x = edge.source.position.x - edge.target.position.x;
    // var delta_y = edge.source.position.y - edge.target.position.y;
    var delta_x = edge.source.layout.tmp_pos_x - edge.target.layout.tmp_pos_x;
    var delta_y = edge.source.layout.tmp_pos_y - edge.target.layout.tmp_pos_y;
    if(layout === "3d") {
      var delta_z = edge.source.layout.tmp_pos_z - edge.target.layout.tmp_pos_z;
    }  
    
    var delta_length = Math.max(EPSILON, Math.sqrt((delta_x * delta_x) + (delta_y * delta_y)));
    if(layout === "3d") {
      var delta_length_z = Math.max(EPSILON, Math.sqrt((delta_z * delta_z) + (delta_y * delta_y)));
    }
    var force = (delta_length * delta_length) / attraction_constant;
    if(layout === "3d") {
      var force_z = (delta_length_z * delta_length_z) / attraction_constant;
    }

    edge.source.layout.force -= force;
    edge.target.layout.force += force;

    edge.source.layout.offset_x -= (delta_x / delta_length) * force;
    edge.source.layout.offset_y -= (delta_y / delta_length) * force;
    if(layout === "3d") {    
      edge.source.layout.offset_z -= (delta_z / delta_length_z) * force_z;
    }
    
    edge.target.layout.offset_x += (delta_x / delta_length) * force;
    edge.target.layout.offset_y += (delta_y / delta_length) * force;
    if(layout === "3d") {    
      edge.target.layout.offset_z += (delta_z / delta_length_z) * force_z;
    }
  };

  var calcPositions = function(graph, node) {
    var delta_length = Math.max(EPSILON, norm(node));
    if(layout === "3d") {    
      var delta_length_z = Math.max(EPSILON, norm2(node));
    }
  
    node.layout.tmp_pos_x += (node.layout.offset_x / delta_length) * Math.min(delta_length, temperature);
    node.layout.tmp_pos_y += (node.layout.offset_y / delta_length) * Math.min(delta_length, temperature);
    if(layout === "3d") {    
      node.layout.tmp_pos_z += (node.layout.offset_z / delta_length_z) * Math.min(delta_length_z, temperature);
    }
    
    var c = 200;
    var updated = false;
    if(node.position.x < (node.layout.tmp_pos_x - c) || node.position.x > (node.layout.tmp_pos_x + c)) {
      node.position.x -=  (node.position.x-node.layout.tmp_pos_x)/10;
      updated = true;
    }
    if(node.position.y < (node.layout.tmp_pos_y - c) || node.position.y > (node.layout.tmp_pos_y + c)) {
      node.position.y -=  (node.position.y-node.layout.tmp_pos_y)/10;
      updated = true;
    }
    if(layout === "3d") {    
      if(node.position.z < (node.layout.tmp_pos_z - c) || node.position.z > (node.layout.tmp_pos_z + c)) {
        node.position.z -=  (node.position.z-node.layout.tmp_pos_z)/10;
        updated = true;
      }
    }

    if(updated && typeof callback_positionUpdated === 'function') {
      callback_positionUpdated(node);
    }
  };

  var norm = function(node) {
    return Math.sqrt(node.layout.offset_x * node.layout.offset_x + node.layout.offset_y * node.layout.offset_y);
  };

  var norm2 = function(node) {
    return Math.sqrt(node.layout.offset_z * node.layout.offset_z + node.layout.offset_y * node.layout.offset_y);
  };

};
