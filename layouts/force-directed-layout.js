/**
  @author David Piegza (@davidpiegza)
  @author Timofey Rechkalov (@TRechkalov)

  Implements a force-directed layout, the algorithm is based on Fruchterman and Reingold and
  the JUNG implementation.

  Needs the graph data structure Graph.js and the Vector3 object:
  https://github.com/davidpiegza/Graph-Visualization/blob/master/Graph.js
  https://github.com/davidpiegza/Graph-Visualization/blob/master/utils/Vector3.js

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

  Examples:

  create:
  layout = new Layout.ForceDirected(graph, {width: 2000, height: 2000, iterations: 1000, layout: "3d"});

  call init when graph is loaded (and for reset or when new nodes has been added to the graph):
  layout.init();

  call generate in a render method, returns true if it's still calculating and false if it's finished
  layout.generate();


  Feel free to contribute a new layout!

 */

var Layout = Layout || {};

Layout.ForceDirected = function(graph, options) {
  options = options || {};

  this.layout = options.layout || "2d";
  this.attraction_multiplier = options.attraction || 5;
  this.repulsion_multiplier = options.repulsion || 0.75;
  this.max_iterations = options.iterations || 1000;
  this.graph = graph;
  this.width = options.width || 200;
  this.height = options.height || 200;
  this.finished = false;

  var callback_positionUpdated = options.positionUpdated;

  var EPSILON = 0.000001;
  var attraction_constant;
  var repulsion_constant;
  var forceConstant;
  var layout_iterations = 0;
  var temperature = 0;
  var nodes_length;
  var edges_length;
  var that = this;

  // performance test
  var mean_time = 0;

  /**
   * Initialize parameters used by the algorithm.
   */
  this.init = function() {
    this.finished = false;
    temperature = this.width / 10.0;
    nodes_length = this.graph.nodes.length;
    edges_length = this.graph.edges.length;
    forceConstant = Math.sqrt(this.height * this.width / nodes_length);
    attraction_constant = this.attraction_multiplier * forceConstant;
    repulsion_constant = this.repulsion_multiplier * forceConstant;
  };

  /**
   * Generates the force-directed layout.
   *
   * It finishes when the number of max_iterations has been reached or when
   * the temperature is nearly zero.
   */
  this.generate = function() {
    if(layout_iterations < this.max_iterations && temperature > 0.000001) {
      var start = new Date().getTime();
      var i, j, delta, delta_length, force, change;

      // calculate repulsion
      for(i=0; i < nodes_length; i++) {
        var node_v = graph.nodes[i];
        node_v.layout = node_v.layout || {};
        if(i === 0) {
          node_v.layout.offset = new Vector3();
        }

        node_v.layout.force = 0;
        node_v.layout.tmp_pos = node_v.layout.tmp_pos || new Vector3().setVector(node_v.position);

        for(j=i+1; j < nodes_length; j++) {
          var node_u = graph.nodes[j];
          if(i != j) {
            node_u.layout = node_u.layout || {};

            node_u.layout.tmp_pos = node_u.layout.tmp_pos || new Vector3().setVector(node_u.position);

            delta = node_v.layout.tmp_pos.clone().sub(node_u.layout.tmp_pos);
            delta_length = Math.max(EPSILON, Math.sqrt(delta.clone().multiply(delta).sum()));

            force = (repulsion_constant * repulsion_constant) / delta_length;

            node_v.layout.force += force;
            node_u.layout.force += force;

            if(i === 0) {
              node_u.layout.offset = new Vector3();
            }

            change = delta.clone().multiply(new Vector3().setScalar(force/delta_length));
            node_v.layout.offset.add(change);
            node_u.layout.offset.sub(change);
          }
        }
      }

      // calculate attraction
      for(i=0; i < edges_length; i++) {
        var edge = graph.edges[i];
        delta = edge.source.layout.tmp_pos.clone().sub(edge.target.layout.tmp_pos);
        delta_length = Math.max(EPSILON, Math.sqrt(delta.clone().multiply(delta).sum()));

        force = (delta_length * delta_length) / attraction_constant;

        edge.source.layout.force -= force;
        edge.target.layout.force += force;

        change = delta.clone().multiply(new Vector3().setScalar(force/delta_length));
        edge.target.layout.offset.add(change);
        edge.source.layout.offset.sub(change);
      }

      // calculate positions
      for(i=0; i < nodes_length; i++) {
        var node = graph.nodes[i];

        delta_length = Math.max(EPSILON, Math.sqrt(node.layout.offset.clone().multiply(node.layout.offset).sum()));

        node.layout.tmp_pos.add(node.layout.offset.clone().multiply(new Vector3().setScalar(Math.min(delta_length, temperature) / delta_length)));

        var updated = true;

        var tmpPosition = new Vector3(node.position.x, node.position.y, node.position.z);
        tmpPosition.sub(node.layout.tmp_pos).divide(new Vector3().setScalar(10));

        node.position.x -= tmpPosition.x;
        node.position.y -= tmpPosition.y;

        if(this.layout === '3d') {
          node.position.z -= tmpPosition.z;
        }

        // execute callback function if position has been updated
        if(updated && typeof callback_positionUpdated === 'function') {
          callback_positionUpdated(node);
        }
      }
      temperature *= (1 - (layout_iterations / this.max_iterations));
      layout_iterations++;

      var end = new Date().getTime();
      mean_time += end - start;
    } else {
      if(!this.finished) {
        console.log("Average time: " + (mean_time/layout_iterations) + " ms");
      }
      this.finished = true;
      return false;
    }
    return true;
  };

  /**
   * Stops the calculation by setting the current_iterations to max_iterations.
   */
  this.stop_calculating = function() {
    layout_iterations = this.max_iterations;
  };
};
