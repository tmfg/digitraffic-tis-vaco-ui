import { useEffect, useRef } from 'react'
import * as Plot from '@observablehq/plot'
import Section from '../Common/Section/Section.tsx'
import { t } from 'i18next'

const TaskStatisticsFigure = ({ groupedData } : { groupedData: Record<string, Record<string, number>> }) => {
  const plotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (groupedData && plotRef.current) {;

      const statusColors: Record<string, string> = {
        'gtfs.canonical': "#25A794",
        'netex.entur': "#EEC200",
        'netex2gtfs.entur': "#E65636",
        'gtfs2netex.fintraffic': "#1777F8",
        'gbfs.entur': "#9696AA",
      };

      const allNames = ["gtfs.canonical", "netex.entur", "netex2gtfs.entur", "gtfs2netex.fintraffic", "gbfs.entur"];

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
          padding: 0,
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
    <Section titleKey={t('admin:statistics:tasksStatusHeader')} hidable={true}>
      <div ref={plotRef}/>
    </Section>
  )

}

export default TaskStatisticsFigure;
