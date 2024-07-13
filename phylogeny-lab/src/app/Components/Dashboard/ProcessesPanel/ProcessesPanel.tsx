import React, { useMemo } from 'react'

import { Card, CardBody, CardFooter, CardHeader, Chip, Divider } from "@nextui-org/react";
import Image from "next/image";
import { Avatar } from '@mui/material';
import Link from 'next/link'
import { FaVirus } from "react-icons/fa6";
import { GiProcessor } from "react-icons/gi";

function ProcessesPanel() {


    const interpolate = useMemo(() => {
        return (
            <svg width="450" height="70">
            <defs>
                <linearGradient id="gradientDefault">
                <stop offset="0%" stop-color="white" />
                <stop offset="25%" stop-color="blue" />
                <stop offset="50%" stop-color="white" />
                <stop offset="75%" stop-color="red" />
                <stop offset="100%" stop-color="white" />
                </linearGradient>
            </defs>
            </svg>

        )
    }, [])

    return (

        <div className="w-full h-full">
            <Card className="w-full dark">
                <CardHeader className="flex gap-3">
                    <div className="flex content-center items-center gap-3 justify-between w-full">
                        <div className="flex content-center gap-3 items-center">

                            <Avatar sx={{ display: 'flex', justifyContent: 'center', background: "transparent", border: '1px solid #808080', color: '#808080', padding: '4px', height: '3.5rem', width: '3.5rem' }}>
                                <GiProcessor size={70} />
                            </Avatar>
                            <p className="text-xl font-semibold">Backend server</p>
                        </div>
                        <Chip style={{ border: 'none' }} color="success" variant="dot">Online</Chip>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <p>Make beautiful websites regardless of your design experience.</p>
                </CardBody>
                <CardFooter>

                </CardFooter>
            </Card>
        </div>

    )
}

export default ProcessesPanel