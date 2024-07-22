"use client"

import React from 'react'
import styled from 'styled-components';
import Card from '../../Components/Card/Card';
import ClustalwForm from '../../Components/Alignment/Clustalw/ClustalwForm';
import { Chip, Tab, Tabs } from '@nextui-org/react';
import MuscleForm from '../../Components/Alignment/Muscle/MuscleForm';
import { RiOmega } from "react-icons/ri";
import { GiMuscleUp } from "react-icons/gi";
import { GiBiceps } from "react-icons/gi";

function page() {
  return (
    <>
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
              <RiOmega />
              <span>Clustalw</span>
            </div>
          }
        >
          <ClustalwForm />
        </Tab>
        <Tab
          key="muscle"
          title={
            <div className="flex items-center space-x-2">
              <GiBiceps />
              <span>Muscle</span>
            </div>
          }
        >
          <MuscleForm />
        </Tab>
        </Tabs>
    </div>  
    </>
  )
}

export default page