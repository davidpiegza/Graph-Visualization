
var Layout = Layout || {};

Layout.ForceDirected = function(graph, options) {
  var options = options || {};
  var EPSILON = 0.000001;
  var attraction_multiplier = options.attraction || 5;
  var attraction_constant;
  var repulsion_multiplier = options.repulsion || 0.75;
  var repulsion_constant;
  var max_dimension;
  var forceConstant;
  var layout_iterations = 0;
  var max_iterations = options.iterations || 10000;
  var temperature = 0;
  var graph = graph;
  var width = options.width || 200;
  var height = options.height || 200;
  
  this.init = function() {
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

      temperature *= (1.0 - (layout_iterations / max_iterations));
      layout_iterations++;
    }
  };

  var calcRepulsion = function(graph, node_v) {
    node_v.layout = node_v.layout || {};
    node_v.layout.offset_x = 0;
    node_v.layout.offset_y = 0;
    node_v.layout.force = 0;
    node_v.layout.tmp_pos_x = node_v.layout.tmp_pos_x || node_v.position.x;
    node_v.layout.tmp_pos_y = node_v.layout.tmp_pos_y || node_v.position.y;

    
    graph.nodes.forEach(function(node_u) {
      if(node_v.id != node_u.id) {
        node_u.layout = node_u.layout || {};
        node_u.layout.tmp_pos_x = node_u.layout.tmp_pos_x || node_u.position.x;
        node_u.layout.tmp_pos_y = node_u.layout.tmp_pos_y || node_u.position.y;

        // var delta_x = node_v.position.x - node_u.position.x;
        // var delta_y = node_v.position.y - node_u.position.y;
        var delta_x = node_v.layout.tmp_pos_x - node_u.layout.tmp_pos_x;
        var delta_y = node_v.layout.tmp_pos_y - node_u.layout.tmp_pos_y;
      
        var delta_length = Math.max(EPSILON, Math.sqrt((delta_x * delta_x) + (delta_y * delta_y)));
        var force = (repulsion_constant * repulsion_constant) / delta_length;

        node_v.layout.force += force;
        node_u.layout.force += force;
        
        node_v.layout.offset_x += (delta_x / delta_length) * force;
        node_v.layout.offset_y += (delta_y / delta_length) * force;
      }
    });
  };

  var calcAttraction = function(graph, edge) {
    // var delta_x = edge.source.position.x - edge.target.position.x;
    // var delta_y = edge.source.position.y - edge.target.position.y;
    var delta_x = edge.source.layout.tmp_pos_x - edge.target.layout.tmp_pos_x;
    var delta_y = edge.source.layout.tmp_pos_y - edge.target.layout.tmp_pos_y;
    
    var delta_length = Math.max(EPSILON, Math.sqrt((delta_x * delta_x) + (delta_y * delta_y)));
    var force = (delta_length * delta_length) / attraction_constant;

    edge.source.layout.force -= force;
    edge.target.layout.force += force;

    edge.source.layout.offset_x -= (delta_x / delta_length) * force;
    edge.source.layout.offset_y -= (delta_y / delta_length) * force;
    edge.target.layout.offset_x += (delta_x / delta_length) * force;
    edge.target.layout.offset_y += (delta_y / delta_length) * force;
  };

  var calcPositions = function(graph, node) {
    var delta_length = Math.max(EPSILON, norm(node));
  
    var new_disp_x = (node.layout.offset_x / delta_length) * Math.min(100, temperature);
    var new_disp_y = (node.layout.offset_y / delta_length) * Math.min(100, temperature);

    var c = 50;
    
    node.layout.tmp_pos_x += Math.max(-c, Math.min(c,new_disp_x));
    node.layout.tmp_pos_y += Math.max(-c, Math.min(c,new_disp_y));
    
    node.position.x = node.layout.tmp_pos_x;
    node.position.y = node.layout.tmp_pos_y;
  };

  var norm = function(node) {
    return Math.sqrt(node.layout.offset_x * node.layout.offset_x + node.layout.offset_y * node.layout.offset_y);
  };

};
