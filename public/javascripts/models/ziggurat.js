// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

const r = 3.6541528853610088
const m1 = 2147483648.0
const vn = 9.91256303526217e-3
const d0 = 3.442619855899
const dinv = 1/d0
const exp = Math.exp(-0.5 * d0 * d0)
const q = vn / exp
const ints0 = Math.floor((d0 / q) * m1)
const reals0 = q / m1
const realsLast = d0 / m1

// num rectangles
class Ziggurat {
  constructor () {
    this.reals = Array(128) // table of real numbers
    this.ints = Array(128)  // table of integers
    this.fx = Array(128)   // precompute f(xi)

    this.seed = 123456789
  }

  // sets a new seed. current seed is XOR'ed against current unixtime
  reseed () {
    this.seed ^= new Date().getTime()
  }

  // creates the tables
  cache () {
    let dn = d0
    let tn = d0

    this.ints[0] = ints0
    this.ints[1] = 0

    this.reals[0] = reals0
    this.reals[127] = realsLast

    this.fx[0] = 1.0
    this.fx[127] = exp

    for (let i = 126; i >= 1; i--) {
      dn = Math.sqrt(-2.0 * Math.log(vn / dn + Math.exp(-0.5 * dn * dn)))

      this.ints[i + 1] = Math.floor((dn / tn) * m1)

      tn = dn

      this.fx[i] = Math.exp(-0.5 * dn * dn)
      this.reals[i] = dn / m1
    }
  }

  // Returns a normally distributed random number with mean 0 and stdev 1
  randomNormal () {
    const hz = this.shiftRegister3()
    const iz = hz & 127

    return Math.abs(hz) < this.ints[iz] ? hz * this.reals[iz] : this.fix(hz, iz)
  }

  fix (hz, iz) {
    let x, y

    while (true) {
      x = hz * this.reals[iz]

      if (iz === 0) {
        x = -Math.log(this.uniformRandomReal()) * dinv
        y = -Math.log(this.uniformRandomReal())

        while (y + y < x * x) {
          x = -Math.log(this.uniformRandomReal()) * dinv
          y = -Math.log(this.uniformRandomReal())
        }

        return hz > 0 ? d0 + x : -d0 - x
      }

      if (this.fx[iz] + this.uniformRandomReal() * (this.fx[iz - 1] - this.fx[iz]) < Math.exp(-0.5 * x * x)) {
        return x
      }

      hz = this.shiftRegister3()
      iz = hz & 127

      if (Math.abs(hz) < this.ints[iz]) {
        return (hz * this.reals[iz])
      }
    }
  }

  // SHR3 - can be used to provide a random 32-bit integer
  // Combined with UNI it can provide a real (float).
  //
  // See George Marsaglia's notes:
  //   http://www.cs.yorku.ca/~oz/marsaglia-rng.html
  //
  // SHR3 is a 3-shift-register generator with period
  // 2^32-1. It uses y(n)=y(n-1)(I+L^17)(I+R^13)(I+L^5),
  // with the y's viewed as binary vectors, L the 32x32
  // binary matrix that shifts a vector left 1, and R its
  // transpose. SHR3 seems to pass all except those
  // related to the binary rank test, since 32 successive
  // values, as binary vectors, must be linearly
  // independent, while 32 successive truly random 32-bit
  // integers, viewed as binary vectors, will be linearly
  // independent only about 29% of the time.
  shiftRegister3 () {
    let prev = this.seed // rename seed
    let next = this.seed

    next ^= (next << 13)
    next ^= (next >>> 17)
    next ^= (next << 5)

    this.seed = next

    return (prev + next) | 0
  }

  // Provides a uniformly random real number (float) in (0, 1)
  uniformRandomReal () {
    return 0.5 + this.shiftRegister3() * 0.2328306e-9
  }
}

export default Ziggurat
