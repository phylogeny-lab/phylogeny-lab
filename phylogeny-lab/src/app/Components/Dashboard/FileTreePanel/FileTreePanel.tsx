import { Avatar, Button, colors } from '@mui/material';
import { Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import 'react-folder-tree/dist/style.css';
import { RiServerFill } from 'react-icons/ri';
import TreeView from "./TreeView";
import { GoFileDirectoryFill } from "react-icons/go";
import { FaFile } from "react-icons/fa6";
import { FaFileZipper } from "react-icons/fa6";
import { FaDownload } from "react-icons/fa";
import axios from 'axios';
import { BASE_URL } from '@/app/consts/consts';
import { TFiles } from './FileData';
import NextButton from "../../Button/Button"
import { formatBytes } from '@/utils/utils';

function FileTreePanel() {
    const onTreeStateChange = (state: any, event: any) => console.log(state, event);
    const [selectedNodes, setSelectedNodes] = useState<Set<any>>(new Set([]))
    const [fileSize, setFileSize] = useState(0)
    const [files, setFiles] = useState<TFiles>({name: 'volume'} as TFiles)

    const requestFiles = () => {

        setSelectedNodes(new Set<any>([]));
        setFileSize(0);
    }

    const getFileTree = async () => {

        await axios.get(BASE_URL + '/volume')
        .then((response: any) => setFiles(response.data))
        .catch((err: any) => console.error(err))
    }

    useEffect(() => {
        
        getFileTree()

        const intervalId = setInterval(getFileTree, 30000);

        return () => clearInterval(intervalId);

    }, [])
    

    return (
            <Card className="w-full dark" style={{gridColumnStart: 3, gridColumnEnd: 4, gridRowStart: 1, gridRowEnd: 5}}>
                <CardHeader className="flex gap-3">
                    <div className="flex content-center items-center gap-3 justify-between w-full">
                        <div className="flex content-center gap-3 items-center">

                            <Avatar sx={{ display: 'flex', justifyContent: 'center', background: "transparent", border: '1px solid #eeeeee', color: colors.grey[200], padding: '6px', height: '3rem', width: '3rem' }}>
                                <GoFileDirectoryFill size={70} />
                            </Avatar>
                            <p className="text-xl font-semibold">File Access</p>
                        </div>

                    </div>
                </CardHeader>
                <Divider />
                <CardBody style={{height: '35vh'}} >
                <TreeView tree={files} setSelectedNodes={setSelectedNodes} setFileSize={setFileSize} />
                </CardBody>
                <Divider />
                <CardFooter style={{display: 'flex', justifyContent: 'space-between', content: 'center', alignItems: 'center'}}>
                    <div className='flex gap-2 items-center content-center'>
                        <div className='text-md text-gray-400 font-thin'>
                            {`${selectedNodes.size} selected`}
                        </div>
                        <div className='text-md text-gray-400 font-thin'>
                            {(fileSize > 0) && formatBytes(fileSize)}
                        </div>
                    </div>
                    <Button 
                        startIcon={<FaDownload size={15} />}
                        color={selectedNodes.size > 0 ? 'primary' : 'inherit'}
                        disabled={!(selectedNodes.size > 0)}
                        variant="contained"
                        onClick={requestFiles}
                        key="download_file_btn"
                    >
                    Download
                    </Button>
                </CardFooter>
            </Card>
    )


}

export default FileTreePanel