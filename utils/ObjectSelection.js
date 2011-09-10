/**
  @author David Piegza

  Implements a selection for objects in a scene.
  
  It invokes a callback function when the mouse enters and when it leaves the object.
  Based on a Three.js selection example.
  
  Parameters:
    domElement: HTMLDomElement
    selected: callback function, passes the current selected object
 */

THREE.ObjectSelection = function(parameters) {
  var parameters = parameters || {};

  this.domElement = parameters.domElement || document;
  this.projector = new THREE.Projector;
  this.INTERSECTED;
  
  var callbackSelected = parameters.selected;
  var mouse = { x: 0, y: 0 };

  this.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  this.render = function(scene, camera) {
    // find intersections
    camera.update();

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    this.projector.unprojectVector( vector, camera );

    var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

    var intersects = ray.intersectScene( scene );
    if( intersects.length > 0 ) {
      if ( this.INTERSECTED != intersects[ 0 ].object ) {
        if ( this.INTERSECTED ) {
          this.INTERSECTED.materials[ 0 ].color.setHex( this.INTERSECTED.currentHex );
        }

        this.INTERSECTED = intersects[ 0 ].object;
        this.INTERSECTED.currentHex = this.INTERSECTED.materials[ 0 ].color.getHex();
        this.INTERSECTED.materials[ 0 ].color.setHex( 0xff0000 );
        callbackSelected(this.INTERSECTED);
      }
    } else {
      if ( this.INTERSECTED ) {
        this.INTERSECTED.materials[ 0 ].color.setHex( this.INTERSECTED.currentHex );
      }
      this.INTERSECTED = null;
      callbackSelected(this.INTERSECTED);
    }
  }  
}






