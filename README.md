# Graph-Visualization

This project is about 3D graph visualization with WebGL. The aim of this project is to evaluate the possibilities of graph drawing in WebGL.

It uses [Three.js](https://threejs.org/) for drawing and currently supports a force directed layout.


### Run the example

You can see the examples at http://davidpiegza.github.io/Graph-Visualization/index.html or:

1. Clone or download the project
2. Open the index.html in a WebGL-compatible browser

The `examples` folder contains all examples.

## Project Description

The project consists of

  - a graph structure
  - a graph layout implementation
  - and a graph drawing implementation

### Graph Structure

This is implemented in [src/graph.js](https://github.com/davidpiegza/Graph-Visualization/blob/master/src/graph.js).

Usage:

```js
  // create a graph with maximum number of nodes (optional)
  var graph = new GRAPHVIS.Graph({limit: 100});
  // create nodes with an id
  var node1 = new GRAPHVIS.Node(1);
  var node2 = new GRAPHVIS.Node(2);
  // add nodes to the graph
  graph.addNode(node1);
  graph.addNode(node2);
  // create edge between nodes
  graph.addEdge(node1, node2);
```

Node:

A node has the properties

  - `ID`
  - `nodesTo`, Array with connected nodes
  - `nodesFrom`, Array with connected nodes
  - `position`, Object for x, y, z position, default is {}
  - `data`, Object with further properties, e.g. properties for a graph layout

For more details have a look at the [source code](https://github.com/davidpiegza/Graph-Visualization/blob/master/src/graph.js).

### Graph Layout

A graph layout has the basic structure:

```js
  var Layout = Layout || {};
  Layout.ForceDirected = function(graph, options) {
    this.init = function() {
      ...
    };

    this.generate = function() {
      ...
    };
  }
```

The `init()` function is called after graph creation, the `generate()` function is called on each render-call.

The graph layout gets the created graph and calculates new positions for the nodes. The `generate()` function is called repeatedly, so there must be a stop condition after finished calculation.

The graph layout may extend the nodes and edges with custom properties in the data object.

See [force-directed-layout.js](https://github.com/davidpiegza/Graph-Visualization/blob/master/src/layouts/force-directed-layout.js) for example usage.


## Contribution

It would be great to have more examples of force-directed graphs or other 3d graph layouts. To add a new example, just copy one of the existing [examples](https://github.com/davidpiegza/Graph-Visualization/blob/master/examples), add a new `Drawing` object and update the `index.html`.

 ***Check out the [open issues](https://github.com/davidpiegza/Graph-Visualization/issues) for a specific task***.

This project uses [Grunt](http://gruntjs.com/) to run several tasks in development. You should have `npm` and `grunt` installed. To install `grunt` run

    npm install -g grunt-cli

And to install all dependencies run

    npm install

For more info check the [Grunt - Getting started guide](http://gruntjs.com/getting-started).

If you added some changes, run `grunt` to check the code.

## Changelog

See [releases](https://github.com/davidpiegza/Graph-Visualization/releases).
