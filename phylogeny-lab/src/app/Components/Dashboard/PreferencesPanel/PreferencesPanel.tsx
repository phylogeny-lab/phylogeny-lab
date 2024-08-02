import { Avatar, colors } from '@mui/material'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import React from 'react'
import { IoCogOutline } from "react-icons/io5";

function PreferencesPanel() {
  return (
    <Card className="dark" style={{gridColumnStart: 3, gridColumnEnd: 4, gridRowStart: 5, gridRowEnd: 9, padding: '1rem', background: 'var(--bg-primary)'}}>
        <CardHeader className="flex gap-3">
                    <div className="flex content-center items-center gap-3 justify-between w-full">
                        <div className="flex content-center gap-3 items-center">

                            <Avatar sx={{ display: 'flex', justifyContent: 'center', background: "transparent", border: '1px solid #eeeeee', color: colors.grey[200], padding: '4px', height: '3rem', width: '3rem' }}>
                            <IoCogOutline size={70} />
                            </Avatar>
                            <p className="text-xl font-semibold">Preferences</p>
                        </div>
                        {/* <ServerStatus status={Status.connected} /> */}

                    </div>
            </CardHeader>
            <Divider />
        <CardBody>

        </CardBody>
    </Card>
  )
}

export default PreferencesPanel