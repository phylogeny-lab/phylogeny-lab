"use client";

import { colors } from '@mui/material';
import { Chip } from '@nextui-org/react';
import { Status } from "@/enums/BackendServerStatus"
import React, { useState } from "react"

interface Props {
    status: Status
}

function ServerStatus({ status }: Props) {

  return (
    <Chip style={{ border: 'none', color: colors.grey[400], fontSize: '16px', textTransform: 'capitalize', opacity: 0.8, fontWeight: 'bolder' }} color={status == Status.connected ? `success` : `default`} variant="dot">{status}</Chip>
    
  )
}

export default ServerStatus