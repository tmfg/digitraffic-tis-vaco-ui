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

  function generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  useEffect(() => {

    if (groupedData && plotRef.current) {

      const completeData = Object.entries(groupedData).flatMap(([date, names]) =>
        allNames.map(name => ({
          name,
          count: names[name] || 0,
          timestamp: date
        }))
      );

      const startDate = Object.keys(groupedData).reduce((min, date) => date < min ? date : min, Object.keys(groupedData)[0]);
      const endDate = Object.keys(groupedData).reduce((max, date) => date > max ? date : max, Object.keys(groupedData)[0]);

      const allDates = generateDateRange(startDate, endDate);

      const filledData = allDates.flatMap(date =>
        allNames.map(name => {
          const existingData = completeData.find(item => item.timestamp === date && item.name === name);
          return existingData ? existingData : { name, count: 0, timestamp: date };
        })
      );

      const sortedCompleteData = filledData.sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampA - timestampB;
      });

      const allData = sortedCompleteData.map(d => ({
        ...d,
        timestamp: new Date(d.timestamp)
      }));

      const plot = Plot.plot({
        width: window.innerWidth,
        marks: [
          Plot.areaY(allData, {
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
          padding: 0,
          tickFormat: "%d/%m%/%y",
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
