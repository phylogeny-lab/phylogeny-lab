import { Avatar, colors } from '@mui/material'
import { Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react'
import React from 'react'
import { ImTree } from "react-icons/im";

function TreeSessionPanel() {
  return (
    <Card className="dark" style={{gridColumnStart: 2, gridColumnEnd: 3, gridRowStart: 1, gridRowEnd: 6, padding: '1rem', background: 'var(--bg-primary)'}}>
        <CardHeader className="flex gap-3">
                    <div className="flex content-center items-center gap-3 justify-between w-full">
                        <div className="flex content-center gap-3 items-center">

                            <Avatar sx={{ display: 'flex', justifyContent: 'center', background: "transparent", border: '1px solid #eeeeee', color: colors.grey[200], padding: '8px', height: '3rem', width: '3rem' }}>
                            <ImTree size={70} />
                            </Avatar>
                            <p className="text-xl font-semibold">Saved sessions</p>
                        </div>
                        {/* <ServerStatus status={Status.connected} /> */}

                    </div>
            </CardHeader>
            <Divider />
            <CardBody>

            </CardBody>
            <CardFooter>
                
            </CardFooter>
    </Card>
  )
}

export default TreeSessionPanel