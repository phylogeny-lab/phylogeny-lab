"use client";

import { Tab, Tabs } from '@nextui-org/react';
import React, { useEffect } from 'react'
import DimensionalityReductionForm from '@/app/Components/FeatureExtraction/DimensionalityReductionForm';
import { VscGraphScatter } from "react-icons/vsc";
import GraphView from '@/app/Components/FeatureExtraction/Graph';

export default function FeatureExtractionPage() {

  useEffect(() => {

  })
  
  return (
    <div className='flex justify-between gap-8' >
      <div className="flex w-full flex-col">
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
            key="clustalw"
            title={
              <div className="flex items-center space-x-2">
                <VscGraphScatter />
                <span>Dim Reduction</span>
              </div>
            }
          >
          <DimensionalityReductionForm />
          </Tab>
        </Tabs>
      </div>

      <div className='w-full'>
        <GraphView />
      </div>
    </div>
  )
}