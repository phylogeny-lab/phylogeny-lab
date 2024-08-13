"use client"

import React, { useEffect, useState } from 'react'
import { Autocomplete, AutocompleteItem, Tab, Tabs } from '@nextui-org/react';
import { FaSquare, FaCube } from "react-icons/fa";
import TwoDimensionChart from '@/app/Components/FeatureExtraction/TwoDimensionChart';
import ThreeDimensionChart from '@/app/Components/FeatureExtraction/ThreeDimensionChart';
import axios from 'axios';
import { BASE_URL } from '@/app/consts/consts';

interface Props {
  currentTask: string;
}

export default function GraphView({ currentTask }: Props) {

  useEffect(() => {

    
  }, [])

  return (

    <div className='text-center flex-col'>

      

    <div>

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
          <TwoDimensionChart currentTask={currentTask} />
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
            <ThreeDimensionChart currentTask={currentTask} />
          </Tab>
        </Tabs>
        </div>
        </div>
  )
}