"use client";

import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import axios from 'axios';
import { BASE_URL } from '@/app/consts/consts';
import { colors, NoDataset, PlotSlider, PlotWrapper } from './GraphUtils';
import { Slider } from '@nextui-org/react';
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

interface Props {
  currentTask: string;
}

function TwoDimensionChart({ currentTask }: Props) {
  const [pca2DCoords, setPca2DCoords] = useState<Object>({})
  const [title, setTitle] = useState("")
  const [markerSize, setMarkerSize] = useState(4)

  useEffect(() => {

    const getCoords = async () => {
      if (currentTask !== "") {
        await axios.get(BASE_URL + `/pca/${currentTask}`).then((res: any) => {
          setPca2DCoords(res.data['2d'])
          setTitle(res.data.title)
        })
        .catch((err: any) => {
          console.error(err)
        })
      }
    }

    getCoords()

  }, [currentTask]);

    const ConvertToPlotlyData = (data: Object, markerSize: number) => {
        const plotlyData: any = []

        Object.entries(data).map(([key, value], i: number) => {
          
            plotlyData.push({
                name: key,
                type: "scatter",
                marker: { size: markerSize, color: colors[i % colors.length] },
                mode: 'markers',
                x: value.x,
                y: value.y,
            })
        })
        return plotlyData
    }

    const masterGraph = {
        title: title,
        xAxis: "PCA1",
        yAxis: "PCA2"
    }
    

  return (
    <PlotWrapper>

        {Object.keys(pca2DCoords).length === 0 ?
        <NoDataset/>
        :
        <>
        <Plot
        className='dark'
        data={ConvertToPlotlyData(pca2DCoords, markerSize)}
        layout={{
          plot_bgcolor: "rgba(0,0,0,0)",
          paper_bgcolor: "rgba(0,0,0,0)",
          height: 650,
          width: 1700,
          margin: {
            l: 10,
            r: 10,
            b: 50,
            t: 50,
            pad: 4
          },
          title: masterGraph.title,
          legend: {
            x: 1,
            xanchor: 'right',
            y: 0
          },
          scene: {
            xaxis: {
              showgrid: false,
              gridcolor: 'red',
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
            }
          }
        }}
      />
      <PlotSlider markerSize={4} setMarkerSize={setMarkerSize} />
      
      </>
    }
    
    </PlotWrapper>
  )
}

export default TwoDimensionChart