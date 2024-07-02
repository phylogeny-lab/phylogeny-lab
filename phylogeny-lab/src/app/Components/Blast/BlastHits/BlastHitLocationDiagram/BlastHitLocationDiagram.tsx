"use client";

import React, { useEffect, useRef, useState } from 'react'
import {
    select,
    line,
    curveCardinal,
    scaleLinear,
    axisBottom,
    axisLeft,
} from "d3";

function BlastHitLocationDiagram() {

    const [data, setData] = useState({ hitLen: 100, hitFrom: 0, hitTo: 100 });

    const svgRef: any = useRef();

    useEffect(() => {

        const svg = select(svgRef.current);

        svg
            .attr("width", data.hitLen)
            .attr("height", 300);

        svg.append("path")
            .attr("d", "m26.71 10.29-10-10a1 1 0 0 0-1.41 0l-10 10 1.41 1.41L15 3.41V32h2V3.41l8.29 8.29z")
            .attr("fill", "yellow")


        svg.append("line")
            .attr("x1", data.hitFrom)
            .attr("y1", 0)
            .attr("x2", data.hitTo)
            .attr("y2", 0)
            .attr("style", "stroke:rgb(255,0,0);stroke-width:2")

        



    }, [data])

    return (

        <>
            <div>
                <svg ref={svgRef}></svg>
            </div>

        </>

    )
}

export default BlastHitLocationDiagram