"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AnimatedListItem } from "../Components/Blast/BlastTable/AnimatedListItem/AnimatedListItem";
import { Chip, Progress, Tooltip } from "@nextui-org/react";
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
import AnimatedTable from "@/app/Components/Table/AnimatedTable";
import { AlignmentTable } from "@/models/AlignmentTable";
import { FaDownload } from "react-icons/fa";
import { ToastFail } from "@/utils/Toast";

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_ENDPOINT


const AlignmentPage = () => {
  const [jobs, setJobs] = useState<AlignmentTable[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const downloadAlignmentJobs = async () => {

    await axios.get(BASE_URL + '/alignment')
    .then((response: any) => {
      const alignmentJobs = new Set<AlignmentTable>([])
      // cycle through and assign status 
      response.data.map((item: AlignmentTable) => {
        alignmentJobs.add(item)
        const statuses = new Set<any>([])
        alignmentJobs.forEach((item: AlignmentTable) => (statuses.add(item.status.toLowerCase())))
        Array.from(statuses).includes(CeleryTaskStatus.STARTED.toLowerCase()) ? setIsLoading(true) : setIsLoading(false)
        setJobs(Array.from(alignmentJobs))
      })
      
    })
    .catch((err: any) => {console.error(err)})
    
  }

  useEffect(() => {

    downloadAlignmentJobs()

    const intervalId = setInterval(downloadAlignmentJobs, 5000);

    return () => clearInterval(intervalId);
    
  }, [])

  const downloadAlignment = async (id: string) => {
      await axios.get(BASE_URL + '/alignment/download/' + id)
      .then((response: any) => {
        
      })
      .catch((err: any) => ToastFail("Could not download file"))
  }

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

  const tableRows = useMemo(() => {
    return (
            <>
            <div className="justify-between px-4 content-center grid grid-cols-5 mt-2">
            <h1 className=" text-sm text-gray-400 font-semibold text-center">JOB</h1>
            <h1 className=" text-sm text-gray-400 font-semibold text-center">ALGORITHM</h1>
            <h1 className="text-sm text-gray-400 font-semibold text-center">TIME STARTED</h1>
            <h1 className="text-sm text-gray-400 font-semibold text-center">STATUS</h1>
            <h1 className="text-sm text-gray-400 font-semibold text-center">ACTIONS</h1>
            <h1 className="invisible">header</h1>
            </div>
              {jobs.length == 0 && (
                <AnimatedListItem>
                  <h1 className="py-4 w-full text-center text-sm text-gray-400 font-semibold mt-6">
                    No queries found.
                  </h1>
                </AnimatedListItem>
              )}
              {jobs.reverse().map((job: AlignmentTable) => (
                <AnimatedListItem key={job.id}>
                  <div className="py-0.5 transition">
                    <div
  
                      className={`grid grid-cols-5 w-full px-4 py-4 justify-between rounded-md transition-colors"}`}
                    >

                      
                        
                        <p className='font-medium transition-colors h-6 text-center'>
                          {job.jobTitle}
                        </p>
                        
                        <p className='font-medium transition-colors h-6 text-center capitalize'>
                          {job.algorithm}
                        </p>
                        
                        <p className="font-medium transition-colors h-6 text-center">
                          {new Date(job.created_at).toDateString() }
                        </p>
                        
                        <div className="flex justify-center">
                        <Chip style={{border: 'none'}} className="dark h-6 capitalize" variant="dot" color={job.status.toLowerCase() === CeleryTaskStatus.STARTED.toLowerCase() ? `warning` : job.status.toLowerCase() === CeleryTaskStatus.FAILED.toLowerCase() ? `danger` : `success`} >{job.status.toLowerCase()}</Chip>
                        </div>

                        { job.status.toLowerCase() == CeleryTaskStatus.SUCCESS.toLowerCase() &&
                        <div className="flex justify-end">
                        
                        <Tooltip content="Download alignment" color='foreground'>
                            <Link href={BASE_URL + '/alignment/download/' + job.id} className="text-lg text-default-400 cursor-pointer active:opacity-50 dark">
                                <FaDownload />
                            </Link>
                        </Tooltip>
                        
                        {/* <Link className="font-light h-6 hover:underline flex gap-0 hover:gap-1.5 transition-all decoration-2 text-end" href={`/blast/${job.id}`}>
                          See Alignment
                          <KeyboardArrowRightIcon />
                        </Link> */}
                        
                        </div>
                        }
  
                    </div>
                  </div>
                </AnimatedListItem>
              ))}
              </>
    )
  }, [jobs])

  return (
    <AnimatedTable height="var(--main-height)" new_job_page="/alignment/new" title="Alignment Jobs" isLoading={isLoading} tableRows={tableRows}  />
  );
};


export default AlignmentPage;