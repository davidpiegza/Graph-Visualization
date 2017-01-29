/**
  @author David Piegza

  Class representing a 3D vector. It is based on the three.js (https://threejs.org) Vector3 class.
 */

function Vector3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}

Object.assign(Vector3.prototype, {
  set: function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  },

  setScalar: function(scalar) {
    this.x = scalar;
    this.y = scalar;
    this.z = scalar;

    return this;
  },

  setVector: function(v) {
    this.x = v.x || 0;
    this.y = v.y || 0;
    this.z = v.z || 0;

    return this;
  },

  setX: function(x) {
    this.x = x;

    return this;
  },

  setY: function(y) {
    this.y = y;

    return this;
  },

  setZ: function(z) {
    this.z = z;

    return this;
  },

  setComponent: function(index, value) {
    switch (index) {
      case 0: this.x = value; break;
      case 1: this.y = value; break;
      case 2: this.z = value; break;
      default: throw new Error('index is out of range: ' + index);
    }

    return this;
  },

  getComponent: function(index) {
    switch(index) {
      case 0: return this.x;
      case 1: return this.y;
      case 2: return this.z;
      default: throw new Error('index is out of range: ' + index);
    }
  },

  clone: function() {
    return new this.constructor(this.x, this.y, this.z);
  },

  copy: function(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  },

  add: function(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  },

  addScalar: function(s) {
    this.x += s;
    this.y += s;
    this.z += s;

    return this;
  },

  addVectors: function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;

    return this;
  },

  addScaledVector: function(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;

    return this;
  },

  sub: function(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  },

  subScalar: function(s) {
    this.x -= s;
    this.y -= s;
    this.z -= s;

    return this;
  },

  subVectors: function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;

    return this;
  },

  multiply: function(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;

    return this;
  },

  multiplyScalar: function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;

    return this;
  },

  multiplyVectors: function(a, b) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    this.z = a.z * b.z;

    return this;
  },

  divide: function(v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;

    return this;
  },

  divideScalar: function (scalar) {
    return this.multiplyScalar(1 / scalar);
  },

  min: function(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);

    return this;
  },

  max: function(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);

    return this;
  },

  sum: function() {
    return this.x + this.y + this.z;
  },

  floor: function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);

    return this;
  },

  ceil: function() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    this.z = Math.ceil(this.z);

    return this;
  },

  round: function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);

    return this;
  },

  equals: function(v) {
    return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
  },
});
