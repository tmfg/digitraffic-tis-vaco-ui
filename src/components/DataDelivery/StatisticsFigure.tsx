import * as Plot from "@observablehq/plot";
import { offset } from '@popperjs/core'

export default function PlotFigure({options}) {

 const stats = [];

  return Plot.plot({
    y: {
      grid: true,
      label: "stats",
      transform: (d) => d / 1000
    },
    marks: [
      Plot.areaY(stats, {x: "", y: "", z: "", fill: "", offset})
    ]
  })
}
