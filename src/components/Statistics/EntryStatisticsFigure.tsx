import { useEffect, useRef } from 'react'
import * as Plot from '@observablehq/plot'
import Section from '../Common/Section/Section.tsx'
import { t } from 'i18next'

const EntryStatisticsFigure = ({ groupedData } : { groupedData: Record<string, Record<string, number>> }) => {
  const plotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {

    if (groupedData && plotRef.current) {

      const statusColors: Record<string, string> = {
        success: "#25A794",
        warnings: "#EEC200",
        errors: "#E65636",
        processing: "#1777F8",
        cancelled: "#9696AA",
        failed: "#B40000",
      };

      const allStatuses = ["success", "warnings", "errors", "processing", "failed", "cancelled"];

      const completeData = Object.entries(groupedData).flatMap(([date, statuses]) =>
        allStatuses.map(status => ({
          status,
          count: statuses[status] || 0,
          timestamp: date
        }))
      );

      const plot = Plot.plot({
        width: window.innerWidth,
        marks: [
          Plot.areaY(completeData, {
            x: "timestamp",
            y: "count",
            z: "status",
            fill: d => statusColors[d.status as keyof typeof statusColors],
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
    <Section titleKey={t('admin:statistics:statusHeader')} hidable={true}>
      <div ref={plotRef}/>
    </Section>
  )

}

export default EntryStatisticsFigure;



