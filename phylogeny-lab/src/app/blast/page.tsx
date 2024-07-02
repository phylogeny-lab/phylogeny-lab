"use client"

import React, { useEffect, useState } from 'react'
import { AnimatedListItem } from '../Components/Blast/BlastTable/AnimatedListItem/AnimatedListItem'
import BlastQueries from '../Components/Blast/BlastTable/BlastQueries/BlastQueries'
import NextTable from '../Components/Blast/BlastDatabases/NextTable/NextTable'
import axios from 'axios'
import { DatabaseStatus } from "@/enums/DatabaseTableStatus"

const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_ENDPOINT



function blastPage() {

  return (
    <main className='flex flex-col justify-between gap-8 w-full'>

      <div className='w-full'>
        <BlastQueries />
      </div>

      <div className='w-full '>
        <NextTable title="Databases" />
      </div>

    </main>
  )
}

export default blastPage