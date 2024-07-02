"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { generateMessage } from "@/utils/MessageGenerator";
import { AnimatedListItem } from "../AnimatedListItem/AnimatedListItem";
import { Chip, Progress } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import Add from '@mui/icons-material/Add';
import { Button } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { BlastQueryStatus } from "@/enums/BlastQueryStatus";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_ENDPOINT


const BlastQueries = () => {
  const [jobs, setJobs] = useState<BlastTable[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    
    axios.get(BASE_URL + '/blast')
    .then((response: any) => {
      const data = response.data
      setJobs(data)

      const statuses = data.map((item: any) => {return item.status})
      setIsLoading(statuses.includes(BlastQueryStatus.IN_PROGRESS))
    })
    .catch((err: any) => {console.error(err)})
  }, [])


  const addJob = () => {
    const newJob = generateMessage();

    setJobs((prev) => {
      return [...prev, newJob];
    });
  };

  const toggleJob = (id: string) => {
    if (selectedJobs.includes(id)) {
      setSelectedJobs((prev) => {
        return prev.filter((i) => i != id);
      });
    } else {
      setSelectedJobs((prev) => {
        return [...prev, id];
      });
    }
  };

  return (
    <div className="bg-[var(--bg-primary)] border-gray-500 border-opacity-20 border-1 rounded-lg">
      <div className="flex justify-between w-full border-b-gray-500 border-opacity-50 border-b-[1px] p-4">
        
        <div className="flex gap-2 items-center">
        <h1 onClick={addJob}
          className="-mx-2 rounded px-2 py-1 font-bold text-large"
        >
          Blast Jobs
        </h1>
        { isLoading &&
        <div className="flex gap-2 items-center">
        <p className="text-gray-500 ml-4">Running</p>
        <CircularProgress color="secondary" size={20} />
        </div>
        }
        </div>

        <Button type="submit" color="primary" variant="contained" onClick={() => router.push('/blast/query')} startIcon={<Add />}>
          New Job
        </Button>
      </div>
      {isLoading && <Progress
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
      />}
      <div className="overflow-y-scroll px-3 py-2 h-52 ">
        {/* <div className="flex justify-between px-4 mt-1">
          
          <h1 className="text-sm text-gray-400 font-semibold">DATABASE</h1>
          <h1 className="text-sm text-gray-400 font-semibold">TIME STARTED</h1>
          <h1 className="text-sm text-gray-400 font-semibold">STATUS</h1>
          <div></div>
        </div> */}
        <ul>
          <AnimatePresence initial={false}>
          <div className="justify-between px-4 content-center grid grid-cols-7 mt-2">
          <h1 className=" text-sm text-gray-400 font-semibold text-center">JOB</h1>
          <h1 className=" text-sm text-gray-400 font-semibold text-center">ALGORITHM</h1>
          <h1 className="text-sm text-gray-400 font-semibold text-center">DATABASE</h1>
          <h1 className="text-sm text-gray-400 font-semibold text-center">SEQUENCE</h1>
          <h1 className="text-sm text-gray-400 font-semibold text-center">TIME STARTED</h1>
          <h1 className="text-sm text-gray-400 font-semibold text-center">STATUS</h1>
          <h1 className="invisible">header</h1>
          </div>
            {jobs.length == 0 && (
              <AnimatedListItem>
                <h1 className="py-4 w-full text-center text-sm text-gray-400 font-semibold mt-6">
                  No queries found.
                </h1>
              </AnimatedListItem>
            )}
            {[...jobs].reverse().map((job) => (
              <AnimatedListItem key={job.id}>
                <div className="py-0.5 transition">
                  <div

                    className={`grid grid-cols-7 w-full px-4 py-4 justify-between rounded-md transition-colors"}`}
                  >
                      
                      <p className='font-medium transition-colors h-6 text-center'>
                        {job.jobTitle}
                      </p>
                      
                      <p className='font-medium transition-colors h-6 text-center'>
                        {job.algorithm}
                      </p>
                      
                      <p className="font-medium transition-colors h-6 text-center">
                        {job.db ? job.db : 'N/A'}
                      </p>

                      <p className="font-medium transition-colors h-6 text-center">
                        {'REPLACE ME'}
                      </p>
                      
                      <p className="font-medium transition-colors h-6 text-center">
                        {new Date(job.created_at).toDateString() }
                      </p>
                      
                      <div className="flex justify-center">
                      <Chip className="dark h-6" variant="dot" color={job.status === BlastQueryStatus.IN_PROGRESS ? `warning` : job.status === BlastQueryStatus.FAILED ? `danger` : `success`} >{job.status}</Chip>
                      </div>

                      <div className="flex justify-center">
                      { job.status == BlastQueryStatus.COMPLETED &&
                      

                      <Link className="font-light h-6 hover:underline flex gap-0 hover:gap-1.5 transition-all decoration-2 text-end" href={`/blast/${job.id}`}>
                        See hits
                        <KeyboardArrowRightIcon />
                      </Link>
                      }
                      </div>

                  </div>
                </div>
              </AnimatedListItem>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default BlastQueries;