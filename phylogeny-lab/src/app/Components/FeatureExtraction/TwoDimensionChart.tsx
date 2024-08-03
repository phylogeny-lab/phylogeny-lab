"use client";

import React from 'react'
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

function TwoDimensionChart() {
    return (

        <Plot
        data={[
          {
            x: [1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18],
            y: [32, 37, 40.5, 43, 49, 54, 59, 63.5, 69.5, 73, 74],
            mode: "markers",
            type: "scatter",
          },
        ]}
        layout={{
          title: "Growth Rate in Boys",
          xaxis: {
            title: "Age (years)",
          },
          yaxis: {
            title: "Height (inches)",
          },
        }}
      />
  
      );
}

export default TwoDimensionChart