"use client";

import React, { useEffect, useState } from 'react'
import BlastResultsTable from '@/app/Components/Blast/BlastResults/BlastResultsTable/BlastResultsTable';
import axios from 'axios';
import { convertToHspTable } from '@/utils/ConvertHspTable';


function HitsPage({params}: any) {

  const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_ENDPOINT

  const [queryId, setQueryId] = useState(params.queryid)
  const [results, setResults] = useState(null)
  const [hsps, setHsps] = useState(null)
  const [blastParams, setBlastParams] = useState<BlastParams>({gapExtend: 0, gapOpen: 0, wordSize: 0, reward: 0, penalty: 0, evalue: 0})

  useEffect(() => {

    if (params.queryid) {
      axios.get(BASE_URL + `/blast/results/${params.queryid}`)
      .then((res: any) => {
        const result = res.data
        setResults(result);
        setHsps(result
          .BlastOutput
          .BlastOutput_iterations
          .Iteration
          .Iteration_hits
          .Hit
          .Hit_hsps
          .Hsp
        )
      })
      .catch((err: any) => {console.error(err)})

      axios.get(BASE_URL + `/blast/${params.queryid}`)
      .then((res: any) => {
        const data = res.data
        setBlastParams({
          gapExtend: data.gapextend, 
          gapOpen: data.gapopen, 
          wordSize: data.word_size, 
          evalue: data.evalue, 
          reward: data.reward, 
          penalty: data.penalty
        } as BlastParams)
      })
      .catch((err: any) => {console.error(err)})
    }
  }, [])
  
  return (
    <>
      <BlastResultsTable id={params.queryid} title='HSPs' hsps={convertToHspTable(hsps)} params={ blastParams } />
    </>
  )
}

export default HitsPage