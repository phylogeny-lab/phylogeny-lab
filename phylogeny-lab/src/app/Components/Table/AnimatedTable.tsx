"use client"

import { Button, CircularProgress } from '@mui/material'
import React from 'react'
import Add from '@mui/icons-material/Add';
import { Progress } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

interface Props {
  isLoading: boolean;
  tableRows: any;
  title: string;
  new_job_page: string;
  fullHeight?: boolean;
  height?: string;
}

function AnimatedTable({ isLoading, tableRows, title, new_job_page, height, fullHeight = false }: Props) {

  const router = useRouter()

  return (
    <div className={`bg-[var(--bg-primary)] border-gray-500 border-opacity-20 border-1 rounded-lg grow ${fullHeight && 'h-[var(--main-height)]'}`}>
      <div className="flex justify-between w-full border-b-gray-500 border-opacity-50 border-b-[1px] p-4">

        <div className="flex gap-2 items-center">
          <h1
            className="-mx-2 rounded px-2 py-1 font-bold text-large"
          >
            {title}
          </h1>
          {isLoading &&
            <div className="flex gap-2 items-center">
              <p className="text-gray-500 ml-4">Running</p>
              <CircularProgress color="secondary" size={20} />
            </div>
          }
        </div>

        <Button type="submit" color="primary" variant="contained" onClick={() => router.push(new_job_page)} startIcon={<Add />}>
          New Job
        </Button>
      </div>
      {isLoading ? <Progress
        size="sm"
        isIndeterminate
        aria-label="Loading..."
        style={{ height: '1px' }}
        classNames={{
          base: "w-full",
          track: "drop-shadow-md border border-0",
          indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
          label: "tracking-wider font-medium text-default-600",
          value: "text-foreground/60",
        }}
      /> :
        <div className="h-[1px]"></div>
      }
      <div className="overflow-y-scroll p-4 dark" style={{height: height}}>
        <ul>
          <AnimatePresence initial={false}>
            {tableRows}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  )
}

export default AnimatedTable