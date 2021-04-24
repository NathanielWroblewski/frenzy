import Vector from './vector.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

class Particle {
  constructor ({ cartesian, spherical }) {
    this.previous = Vector.zeroes()
    this.cartesian = cartesian
    this.spherical = spherical
  }

  get θ () {
    return this.spherical.y
  }

  get φ () {
    return this.spherical.z
  }

  moveTo (cartesian) {
    this.previous = this.cartesian
    this.cartesian = this.cartesian.add(cartesian.subtract(this.cartesian).multiply(0.1))
  }

  get velocity () {
    return this.cartesian.subtract(this.previous)
  }
}

export default Particle
