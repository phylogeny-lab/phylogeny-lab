"use client";

import React from 'react'
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

function ThreeDimensionChart() {

    const colors = ['rgba(74,222,128,.8)', 'rgba(59,130,246,.8)', 'rgba(235,64,52,.8)']

    const ConvertToPlotlyData = (data: any, markerSize: number) => {
        const plotlyData: any = []
        data.map((datum: any, i: number) => {
            plotlyData.push({
                name: datum.name,
                type: "scatter3d",
                marker: { size: markerSize, color: colors[i] },
                mode: 'markers',
                x: datum.x,
                y: datum.y,
                z: datum.z,
            })
        })
        return plotlyData
    }

    const graphData: any = [{
        name: 'Orang',
        x: [630, 310, 260, 566, 566, 400, 515, 630, 151, 400, 515, 176, 230, 260, 151, 648, 648, 176, 230, 310], 
        y: [200, 100, 200, 100, 200, 100, 100, 100, 600, 200, 200, 200.1234, 200, 100, 100, 200, 100, 600, 100, 200], 
        z: [495, 18, 104, 33, 33, 615, 10, 495, 420, 615, 10, 232, 515, 104, 420, 327, 327, 232, 515, 18],  
    
      },
      {
        name: 'Chimp',
        x: [636, 310, 260, 566, 566, 400, 515, 630, 151, 400, 515, 176, 260, 21, 151, 648, 648, 186, 230, 300], 
        y: [200, 100, 200, 100, 600, 15, 100, 100, 200, 200, 200, 200.1234, 200, 100, 600, 208, 100, 100, 100, 200], 
        z: [495, 18, 134, 33, 33, 615, 10, 200, 420, 615, 10, 232, 52, 104, 420, 327, 327, 232, 515, 18],  
      },
      {
        name: 'Human',
        x: [636, 310, 260, 566, 266, 400, 515, 630, 151, 400, 515, 176, 260, 201, 151, 648, 648, 186, 280, 300], 
        y: [210, 100, 200, 100, 600, 15, 100, 100, 200, 100, 200, 200.1234, 200, 100, 600, 108, 100, 100, 100, 200], 
        z: [495, 18, 144, 33, 33, 315, 10, 200, 420, 615, 10, 232, 52, 104, 420, 327, 327, 232, 585, 10],  
      },
    ];

    const masterGraph = {
        title: "Title",
        xAxis: "PCA1",
        yAxis: "PCA2",
        zAxis: "PCA3"
    }
    

  return (
    <div>
        <Plot
        data={ConvertToPlotlyData(graphData, 4)}
        layout={{
          plot_bgcolor: "rgba(0,0,0,0)",
          paper_bgcolor: "rgba(0,0,0,0)",
          width: 800,
          height: 600,
          margin: {
            l: 20,
            r: 20,
            b: 50,
            t: 50,
            pad: 4
          },
          title: masterGraph.title,
          annotations: [],
          legend: {
            x: 1,
            xanchor: 'right',
            y: 0
          },
          scene: {
            xaxis: {
              showgrid: false,
              title: masterGraph.xAxis,
              titlefont: {
                family: "Courier New, monospace",
                size: 12,
                color: "#444444"
              }
            },
            yaxis: {
              showgrid: false,
              title: masterGraph.yAxis,
              titlefont: {
                family: "Courier New, monospace",
                size: 12,
                color: "#444444"
              }
            },
            zaxis: {
              showgrid: false,
              title: masterGraph.zAxis,
              titlefont: {
                family: "Courier New, monospace",
                size: 12,
                color: "#444444"
              }
            }
          }
        }}
      />
    </div>
  )
}

export default ThreeDimensionChart