"use client";

import React, { useEffect, useState } from 'react'

import { Card, CardBody, CardFooter, CardHeader, Chip, Divider, Tabs, Tab } from "@nextui-org/react";
import { Avatar, IconButton } from '@mui/material';
import { GiProcessor } from "react-icons/gi";
import { colors } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import ServerStatus from "./ServerStatus"
import { Status } from '@/enums/BackendServerStatus';
import TaskTable from "./TaskTable"
import { getTasks, getWorkers } from '@/utils/WorkerApi';
import { convertToTaskTable } from "@/utils/WorkerApi"
import { HiServer } from "react-icons/hi2";
import { RiServerFill } from "react-icons/ri";
import WorkerTable from './WorkerTable';
import { VscServerProcess } from "react-icons/vsc";

export default function ProcessesPanel() {

    const [tasks, setTasks] = useState(null)
    const [workers, setWorkers] = useState(null)
    const [broker, setBroker] = useState(null)

    const getBackendInfo = () => {

        getTasks().then((tasks: any) => setTasks(tasks))
        getWorkers().then((workers: any) => setWorkers(workers))
    }

    useEffect(() => {
        
        getBackendInfo()

        const intervalId = setInterval(getBackendInfo, 10000);

        return () => clearInterval(intervalId);

    }, [])

    return (

            <Card className="w-full dark" style={{gridColumnStart: 1, gridColumnEnd: 2, gridRowStart: 1, gridRowEnd: 5}}>
                <CardHeader className="flex gap-3">
                    <div className="flex content-center items-center gap-3 justify-between w-full">
                        <div className="flex content-center gap-3 items-center">

                            <Avatar sx={{ display: 'flex', justifyContent: 'center', background: "transparent", border: '1px solid #eeeeee', color: colors.grey[200], padding: '6px', height: '3rem', width: '3rem' }}>
                            <VscServerProcess size={70} />
                            </Avatar>
                            <p className="text-xl font-semibold">Backend server</p>
                        </div>
                        <ServerStatus status={Status.connected} />

                    </div>
                </CardHeader>
                <Divider />
                <CardBody >

                <div className='absolute top-3 right-4 flex gap-2'>

                <Tooltip title="Delete" sx={{width: '2rem', height: '2rem', color: colors.grey[400]}} >
                <IconButton>
                    <InfoIcon />
                </IconButton>
                </Tooltip>

                <Tooltip title="Delete" sx={{width: '2rem', height: '2rem', color: colors.grey[400]}}>
                <IconButton>
                <RestartAltIcon />
                </IconButton>
                </Tooltip>

                </div>
                    
                    <Tabs aria-label="Options" color='success'>
                        <Tab key="workers" title="Workers">
                            <Card>
                                    {workers &&
                                    <WorkerTable workers={workers} />}
                            </Card>
                        </Tab>
                        <Tab key="tasks" title="Tasks">
                            <Card>
     
                                    {tasks &&
                                    <TaskTable tasks={convertToTaskTable(tasks)}/>
                                    }
                            </Card>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
    )
}