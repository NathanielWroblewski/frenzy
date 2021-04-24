import { τ } from '../constants/dimensions.js'

// Copyright (c) 2020 Nathaniel Wroblewski
// I am making my contributions/submissions to this project solely in my personal
// capacity and am not conveying any rights to any intellectual property of any
// third parties.

const render = (context, [x, y], r, stroke, fill, alpha) => {
  context.beginPath()
  context.arc(x, y, r, 0, τ)

  if (fill) context.fill()
  if (stroke) context.stroke()
}

export default render
