// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

class Vector extends Array {
  get x () {
    return this[0]
  }

  get y () {
    return this[1]
  }

  get z () {
    return this[2]
  }

  get magnitude () {
    return this.reduce((memo, element) => memo += element * element, 0)
  }

  multiply (scalar) {
    return this.map(element => element * scalar)
  }

  dot (vector) {
    return this.reduce((memo, element, index) => element * vector[index], 0)
  }

  add (value) {
    if (typeof(value) === 'number') {
      return this.map(element => element + value)
    } else if (value instanceof Vector) {
      return this.map((element, index) => element + value[index])
    } else {
      throw "Argument to Vector#add must be scalar or vector"
    }
  }

  subtract (value) {
    if (typeof(value) === 'number') {
      return this.add(-value)
    } else if (value instanceof Vector) {
      return this.map((element, index) => element - value[index])
    } else {
      throw "Argument to Vector#subtract must be scalar or vector"
    }
  }

  static zeroes () {
    return this.from([0, 0, 0])
  }
}

export default Vector
