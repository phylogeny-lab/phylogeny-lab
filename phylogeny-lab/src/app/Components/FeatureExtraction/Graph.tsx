"use client";

import { Tab, Tabs } from '@nextui-org/react';
import React from 'react'
import { FaSquare } from "react-icons/fa";
import { FaCube } from "react-icons/fa";

function Graph() {
  return (
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
            key="2dGraph"
            title={
              <div className="flex items-center space-x-2">
                <FaSquare />
                <span>2D</span>
              </div>
            }
          >
          
          </Tab>
          <Tab
            key="3dGraph"
            title={
              <div className="flex items-center space-x-2">
                <FaCube />
                <span>3D</span>
              </div>
            }
          >

          </Tab>
        </Tabs>
  )
}

export default Graph