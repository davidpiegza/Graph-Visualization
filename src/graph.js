/**
  @author David Piegza

  Implements a graph structure.
  Consists of Graph, Nodes and Edges.


  Nodes:
  Create a new Node with an id. A node has the properties
  id, position and data.

  Example:
  node = new GRAPHVIS.Node(1);
  node.position.x = 100;
  node.position.y = 100;
  node.data.title = "Title of the node";

  The data property can be used to extend the node with custom
  informations. Then, they can be used in a visualization.


  Edges:
  Connects to nodes together.

  Example:
  edge = new GRAPHVIS.Edge(node1, node2);

  An edge can also be extended with the data attribute. E.g. set a
  type like "friends", different types can then be draw in differnt ways.


  Graph:

  Parameters:
  options = {
    limit: <int>, maximum number of nodes
  }

  Methods:
  addNode(node) - adds a new node and returns true if the node has been added,
                  otherwise false.
  getNode(node_id) - returns the node with node_id or undefined, if it not exist
  addEdge(node1, node2) - adds an edge for node1 and node2. Returns true if the
                          edge has been added, otherwise false (e.g.) when the
                          edge between these nodes already exist.

  reached_limit() - returns true if the limit has been reached, otherwise false

 */

var GRAPHVIS = GRAPHVIS || {};

GRAPHVIS.Graph = function(options) {
  this.options = options || {};
  this.nodeSet = {};
  this.nodes = [];
  this.edges = [];
  this.layout = undefined;
};

GRAPHVIS.Graph.prototype.addNode = function(node) {
  if(this.nodeSet[node.id] === undefined && !this.reached_limit()) {
    this.nodeSet[node.id] = node;
    this.nodes.push(node);
    return true;
  }
  return false;
};

GRAPHVIS.Graph.prototype.getNode = function(node_id) {
  return this.nodeSet[node_id];
};

GRAPHVIS.Graph.prototype.addEdge = function(source, target) {
  if(source.addConnectedTo(target) === true) {
    var edge = new GRAPHVIS.Edge(source, target);
    this.edges.push(edge);
    return true;
  }
  return false;
};

GRAPHVIS.Graph.prototype.reached_limit = function() {
  if(this.options.limit !== undefined)
    return this.options.limit <= this.nodes.length;
  else
    return false;
};


GRAPHVIS.Node = function(node_id) {
  this.id = node_id;
  this.nodesTo = [];
  this.nodesFrom = [];
  this.position = {};
  this.data = {};
};

GRAPHVIS.Node.prototype.addConnectedTo = function(node) {
  if(this.connectedTo(node) === false) {
    this.nodesTo.push(node);
    return true;
  }
  return false;
};

GRAPHVIS.Node.prototype.connectedTo = function(node) {
  for(var i=0; i < this.nodesTo.length; i++) {
    var connectedNode = this.nodesTo[i];
    if(connectedNode.id == node.id) {
      return true;
    }
  }
  return false;
};


GRAPHVIS.Edge = function(source, target) {
  this.source = source;
  this.target = target;
  this.data = {};
};
