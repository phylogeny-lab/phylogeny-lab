"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { generateMessage } from "@/utils/MessageGenerator";
import { AnimatedListItem } from "../AnimatedListItem/AnimatedListItem";
import { Chip, Progress } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import Add from '@mui/icons-material/Add';
import { Button } from "@mui/material";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { CircularProgress } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { BlastQueryStatus } from "@/enums/BlastQueryStatus";
import Link from "next/link";
import { getTaskResult, getTasks } from "@/utils/WorkerApi";
import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus";
import { BlastTable } from "@/models/BlastTable";
import { stringify } from "querystring";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_ENDPOINT


const BlastQueries = () => {
  const [jobs, setJobs] = useState<BlastTable[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const downloadBlastJobs = async () => {

    await axios.get(BASE_URL + '/blast')
    .then((response: any) => {
      const blastJobs = new Set<BlastTable>([])
      // cycle through and assign status 
      response.data.map((item: BlastTable) => {
        blastJobs.add(item)
        const statuses = new Set<any>([])
        blastJobs.forEach((item: BlastTable) => (statuses.add(item.status.toLowerCase())))
        Array.from(statuses).includes(CeleryTaskStatus.STARTED.toLowerCase()) ? setIsLoading(true) : setIsLoading(false)
        setJobs(Array.from(blastJobs))
        // getTaskResult(item.id).then((result: CeleryTaskStatus) => {
        //   item.status = result
        //   blastJobs.add(item)
        // }).catch((err: any) => {
        //   console.error(err)
        // }).finally(() => {
          
        //   if (blastJobs.size != jobs.length || Array.from(blastJobs).map((item: BlastTable, i: number) => (item.status !== jobs[i].status))) {

        //     if (jobs.length == 0 || !(jobs.map((item: BlastTable) => blastJobs.has(item)))) {
        //       setJobs(Array.from(blastJobs))
        //     }
            

            
        //   }
        // })
      })
      
    })
    .catch((err: any) => {console.error(err)})
    
  }

  useEffect(() => {

    downloadBlastJobs()

    const intervalId = setInterval(downloadBlastJobs, 10000);

    return () => clearInterval(intervalId);
    
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

  const queryTable = useMemo(() => {
    return (
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
              {jobs.reverse().map((job: BlastTable) => (
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
                        <Chip className="dark h-6 capitalize" variant="dot" color={job.status.toLowerCase() === CeleryTaskStatus.STARTED.toLowerCase() ? `warning` : job.status.toLowerCase() === CeleryTaskStatus.FAILED.toLowerCase() ? `danger` : `success`} >{job.status.toLowerCase()}</Chip>
                        </div>
  
                        <div className="flex justify-center">
                        { job.status == CeleryTaskStatus.SUCCESS &&
                        
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
    )
  }, [jobs])

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
      <div className="h-[1px]"></div>}
      <div className="overflow-y-scroll px-3 py-2 h-52 ">
        <ul>
          {queryTable}
        </ul>
      </div>
    </div>
  );
};



export default BlastQueries;