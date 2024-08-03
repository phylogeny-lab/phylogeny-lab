"use client"

import React, { useEffect } from 'react'
import { Tab, Tabs } from '@nextui-org/react';
import { FaSquare, FaCube } from "react-icons/fa";
import TwoDimensionChart from '@/app/Components/FeatureExtraction/TwoDimensionChart';
import ThreeDimensionChart from '@/app/Components/FeatureExtraction/ThreeDimensionChart';

export default function GraphView() {

  useEffect(() => {

  })

  return (

    <div className='text-center'>
    <Tabs
          aria-label="Options"
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-[#22d3ee]",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-[#06b6d4]"
          }}
        >
          <Tab
            key="twodGraph"
            title={
              <div className="flex items-center space-x-2">
                <FaSquare />
                <span>2D</span>
              </div>
            }
          >
          <TwoDimensionChart />
          </Tab>
          <Tab
            key="threedGraph"
            title={
              <div className="flex items-center space-x-2">
                <FaCube />
                <span>3D</span>
              </div>
            }
          >
            <ThreeDimensionChart />
          </Tab>
        </Tabs>
        </div>
  )
}