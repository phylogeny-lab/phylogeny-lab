import { Avatar, colors } from '@mui/material';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';
import React, { useState } from 'react'
import 'react-folder-tree/dist/style.css';
import { RiServerFill } from 'react-icons/ri';
import TreeView from "./TreeView";
import { files } from "./FileData"
import { GoFileDirectoryFill } from "react-icons/go";
import { FaFile } from "react-icons/fa6";
import { FaFileZipper } from "react-icons/fa6";

function FileTreePanel() {
    const onTreeStateChange = (state: any, event: any) => console.log(state, event);
    const [selectedNodes, setSelectedNodes] = useState([])
    

    return (
        <div className="w-full h-full">
            <Card className="w-full dark">
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
                <CardBody>
                <TreeView tree={files} setSelectedNodes={setSelectedNodes} />
                </CardBody>
                <Divider />
                <CardFooter>
                    <Button style={{borderRadius: '0.375rem'}} color='success' onClick={() => alert(JSON.stringify(selectedNodes))}>
                        Download
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )


}

export default FileTreePanel