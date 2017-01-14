# Create minified version

Using `uglifyjs`:

    npm install uglify-js -g
    uglifyjs -c -m -- Graph.js webgl-frameworks/Three.js utils/*.js layouts/*.js drawings/*.js > build/graph.min.js
