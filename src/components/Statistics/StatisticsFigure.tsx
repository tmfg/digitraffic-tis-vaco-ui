import { useEffect, useRef } from 'react'
import * as Plot from '@observablehq/plot'

interface StatusConfig {
  header: string
  allNames: string[];
  statusColors: Record<string, string>;
}

interface TaskStatisticsFigureProps {
  groupedData: Record<string, Record<string, number>>;
  config: StatusConfig;
  isOpen: boolean
}


const StatisticsFigure = ({ groupedData, config } :  TaskStatisticsFigureProps) => {
  const plotRef = useRef<HTMLDivElement | null>(null);
  const { allNames, statusColors } = config;

  useEffect(() => {

    if (groupedData && plotRef.current) {

      const completeData = Object.entries(groupedData).flatMap(([date, names]) =>
        allNames.map(name => ({
          name,
          count: names[name] || 0,
          timestamp: date
        }))
      );

      const plot = Plot.plot({
        width: window.innerWidth,
        marks: [
          Plot.areaY(completeData, {
            x: "timestamp",
            y: "count",
            z: "name",
            fill: d => statusColors[d.name as keyof typeof statusColors],
            offset: "wiggle",
            curve: "bump-x",

          }),
        ],
        x: {
          label: "",
          type: "point",
          padding: 0.025,
        },

        y: {
          label:"",
          grid: true,
        },
        color: {
          domain: Object.keys(statusColors),
          range: Object.values(statusColors),
          legend: true
        },

      });

      if (plotRef.current) {
        if ('innerHTML' in plotRef.current) {
          plotRef.current.innerHTML = ''
        }
        if ('appendChild' in plotRef.current) {
          plotRef.current.appendChild(plot)
        }
      }
    }
  }, [groupedData]);

  return (
      <div ref={plotRef}/>
  )

}

export default StatisticsFigure;
