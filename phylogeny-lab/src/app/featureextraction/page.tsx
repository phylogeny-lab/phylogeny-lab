"use client";

import { Autocomplete, AutocompleteItem, Divider, Tab, Tabs } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import DimensionalityReductionForm from '@/app/Components/FeatureExtraction/DimensionalityReductionForm';
import { VscGraphScatter } from "react-icons/vsc";
import GraphView from '@/app/Components/FeatureExtraction/Graph';
import axios from 'axios';
import { BASE_URL } from '../consts/consts';
import TwoDimensionChart from '../Components/FeatureExtraction/TwoDimensionChart';
import ThreeDimensionChart from '../Components/FeatureExtraction/ThreeDimensionChart';
import { FaCube, FaSquare } from 'react-icons/fa6';

export default function FeatureExtractionPage() {

  const [currentTask, setCurrentTask] = useState("")
  const [jobs, setJobs] = useState([])

  const getJobs = async () => {
    await axios.get(BASE_URL + '/pca').then((res: any) => {
      setJobs(res.data)
    })
      .catch((err: any) => console.error(err))
  }

  useEffect(() => {

    getJobs()

  }, [])

  return (
    <div className=' h-full' >
      <div className='flex gap-8 -mt-5 justify-between w-full content-center items-center'>
        <div className='flex content-center items-center gap-8'>
          <Autocomplete
            label="Select a job"
            className="max-w-xs dark"
            onSelectionChange={(id: any) => {
              setCurrentTask(id)
            }}
          >
            {jobs.map((job: any) => (
              <AutocompleteItem className='dark' key={job.id} value={job.title}>
                {job.title}
              </AutocompleteItem>
            ))}
          </Autocomplete>

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

        

        <div>
          <DimensionalityReductionForm setCurrentTask={setCurrentTask} resetJobs={getJobs} />
        </div>
      </div>

      <Divider className='fixed mt-4 -translate-x-10' />

    </div>
  )
}