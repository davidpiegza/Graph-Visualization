
function Graph(options) {
  this.options = options || {};
  this.nodeSet = {};
  this.nodes = [];
  this.edges = [];
}

Graph.prototype.addNode = function(node) {
  if(this.nodeSet[node.id] == undefined && !this.reached_limit()) {
    this.nodeSet[node.id] = node;
    this.nodes.push(node);
    return true;
  }
  return false;
};

Graph.prototype.getNode = function(node_id) {
  return this.nodeSet[node_id];
};

Graph.prototype.addEdge = function(source, target) {
  if(source.addConnectedTo(target) === true) {
    var edge = new Edge(source, target);
    this.edges.push(edge);
    return true;
  }
  return false;
};

Graph.prototype.reached_limit = function() {
  if(this.options.limit != undefined)
    return this.options.limit <= this.nodes.length;
  else
    return false;
};


function Node(node_id) {
  this.id = node_id;
  this.nodesTo = [];
  this.nodesFrom = [];
  this.position = {};
  this.data = {};
}

Node.prototype.addConnectedTo = function(node) {
  if(this.connectedTo(node) === false) {
    this.nodesTo.push(node);
    return true;
  }
  return false;
};

Node.prototype.connectedTo = function(node) {
  for(var i=0; i < this.nodesTo.length; i++) {
    var connectedNode = this.nodesTo[i];
    if(connectedNode.id == node.id) {
      return true;
    }
  }
  return false;
};


function Edge(source, target) {
  this.source = source;
  this.target = target;
  this.data = {};
}
