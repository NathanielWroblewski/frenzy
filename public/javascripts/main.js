import Ziggurat from './models/ziggurat.js'
import Vector from './models/vector.js'
import Particle from './models/particle.js'
import coordinates from './isomorphisms/coordinates.js'
import renderCircle from './views/circle.js'
import renderLine from './views/line.js'
import { seed, noise } from './utilities/noise.js'
import { PARTICLE } from './constants/colors.js'
import {
  PARTICLE_COUNT, SPHERE_RADIUS, WIDTH, HEIGHT, HALF_WIDTH, HALF_HEIGHT,
  PARTICLE_RADIUS, RESOLUTIONS, FPS
} from './constants/dimensions.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

const canvas = document.querySelector('.canvas')
const context = canvas.getContext('2d')
const ziggurat = new Ziggurat()

ziggurat.reseed()
ziggurat.cache()
seed(Math.random())

context.strokeStyle = PARTICLE
context.fillStyle = PARTICLE

// Initialize

const sampleSphereSurface = (radius = 1) => {
  const coords = Vector.from([
    ziggurat.randomNormal(),
    ziggurat.randomNormal(),
    ziggurat.randomNormal()
  ])

  return coords.multiply(radius / Math.sqrt(coords.magnitude)).add(Vector.from([HALF_WIDTH, HALF_HEIGHT, 0]))
} // rare but possible divide by zero if x, y, z === (0, 0, 0)

const points = []

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const cartesian = sampleSphereSurface(SPHERE_RADIUS)
  const spherical = coordinates.toSpherical(cartesian)
  const particle = new Particle({ cartesian, spherical })

  points.push(particle)
}

// Render loop

let time = 0
let resolution = RESOLUTIONS[0]
const numResolutions = RESOLUTIONS.length

const render = () => {
  const resolution = RESOLUTIONS[Math.round(time) % numResolutions]

  context.clearRect(0, 0, WIDTH, HEIGHT)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = points[i]

    const Δθ = noise(particle.cartesian.x * resolution, particle.cartesian.y * resolution, time)
    const Δφ = noise(particle.cartesian.y * resolution, particle.cartesian.z * resolution, time)

    const spherical = particle.spherical.add(Vector.from([0, Δθ, Δφ]))
    const cartesian = coordinates.toCartesian(spherical)

    particle.spherical = spherical
    particle.moveTo(cartesian)

    renderLine(context, particle.cartesian.subtract(particle.velocity.multiply(1.5)), particle.cartesian, PARTICLE, 0.1)
    renderCircle(context, particle.cartesian, PARTICLE_RADIUS, PARTICLE, PARTICLE)
  }

  time += 0.01
}

let prevTick = 0

const step = () => {
  window.requestAnimationFrame(step)

  const now = Math.round(FPS * Date.now() / 1000)
  if (now === prevTick) return
  prevTick = now

  render()
}

step()
