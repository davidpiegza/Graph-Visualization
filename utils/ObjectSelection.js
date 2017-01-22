/**
  @author David Piegza

  Implements a selection for objects in a scene.

  It invokes a callback function when the mouse enters and when it leaves the object.
  Based on a Three.js selection example.

  Parameters:
    domElement: HTMLDomElement
    selected: callback function, passes the current selected object (on mouseover)
    clicked: callback function, passes the current clicked object
 */

THREE.ObjectSelection = function(parameters) {
  parameters = parameters || {};

  this.domElement = parameters.domElement || document;
  this.INTERSECTED = null;

  var _this = this;

  var callbackSelected = parameters.selected;
  var callbackClicked = parameters.clicked;
  var mouse = { x: 0, y: 0 };

  this.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
  function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }

  this.domElement.addEventListener( 'click', onDocumentMouseClick, false );
  function onDocumentMouseClick( event ) {
    if(_this.INTERSECTED) {
      if(typeof callbackClicked === 'function') {
        callbackClicked(_this.INTERSECTED);
      }
    }
  }

  this.render = function(scene, camera) {
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    vector.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObject(scene, true);

    if( intersects.length > 0 ) {
      if ( this.INTERSECTED != intersects[ 0 ].object ) {
        if ( this.INTERSECTED ) {
          this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
        }

        this.INTERSECTED = intersects[ 0 ].object;
        this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
        this.INTERSECTED.material.color.setHex( 0xff0000 );
        if(typeof callbackSelected === 'function') {
          callbackSelected(this.INTERSECTED);
        }
      }
    } else {
      if ( this.INTERSECTED ) {
        this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
      }
      this.INTERSECTED = null;
      if(typeof callbackSelected === 'function') {
        callbackSelected(this.INTERSECTED);
      }
    }
  };
};
