"use client";

import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useParams } from 'next/navigation'
import axios from "axios";
import { BASE_URL } from "@/app/consts/consts";
import Card from "@/app/Components/Card/Card";
import { convertToHspTable } from "@/utils/ConvertHspTable";
import BlastHitLocationDiagram from "@/app/Components/Blast/BlastHits/BlastHitLocationDiagram/BlastHitLocationDiagram";
import { Chip, Input, Pagination } from "@nextui-org/react";
import NucleotideLetter from "@/app/Components/Blast/BlastHits/NucleotideLetter/NucleotideLetter";
import Search from "@mui/icons-material/Search";


export default function ResultsPage() {

    const Params = useParams<{ id: any, queryid: any }>()
    const [selectedHsps, setSelectedHsps] = useState<HspTable>()
    const [displayedLetters, setDisplayedLetters] = useState(500)
    const [page, setPage] = useState(1)
    const [filterValue, setFilterValue] = React.useState("");
    const [queryName, setQueryName] = useState("")
    
    const currIndex = ((index: number) => {

        return index + (page - 1) * displayedLetters

    })

    const QueryBackgroundSearch = ((index: number) => { if(filteredItemsFirstOccurIndex) {
        return (currIndex(index) >= filteredItemsFirstOccurIndex?.query.start && currIndex(index) <= filteredItemsFirstOccurIndex?.query.end)
    }})

    const HitsBackgroundSearch = ((index: number) => { if(filteredItemsFirstOccurIndex) {
        return (currIndex(index) >= filteredItemsFirstOccurIndex?.hits.start && currIndex(index) <= filteredItemsFirstOccurIndex?.hits.end)
    }})

    const filteredItemsFirstOccurIndex = React.useMemo(() => {

        if(selectedHsps) {
            const searchPosQueryStart = selectedHsps.qseq.indexOf(filterValue)
            const searchPosQueryEnd = searchPosQueryStart === -1 ? -1 : searchPosQueryStart + filterValue.length - 1
            const searchPosHitsStart = selectedHsps.hseq.indexOf(filterValue)
            const searchPosHitsEnd = searchPosHitsStart === -1 ? -1 : searchPosHitsStart + filterValue.length - 1

            if (searchPosQueryStart > 0) { setPage(Math.ceil((searchPosQueryStart + 1) / displayedLetters)) }
            else if(searchPosHitsStart > 0) { setPage(Math.ceil((searchPosHitsStart + 1) / displayedLetters)) }
            else { setPage(1) }

            return {
                'query': { start: searchPosQueryStart, end: searchPosQueryEnd }, 
                'hits': { start: searchPosHitsStart, end: searchPosHitsEnd }
            };
        }

        
    }, [filterValue]);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
            setPage(1)
        }
    }, []);

    useEffect(() => {

        if (Params.queryid) {
            axios.get(BASE_URL + `/blast/results/${Params.queryid}`)
                .then((res: any) => {
                    const result = res.data
                    const hsps = result
                        .BlastOutput
                        .BlastOutput_iterations
                        .Iteration
                        .Iteration_hits
                        .Hit
                        .Hit_hsps
                        .Hsp

                    const hspcsTable = convertToHspTable(hsps)
                    const queryName = result.BlastOutput['BlastOutput_query-def']
                    setSelectedHsps(hspcsTable[Params.id - 1])
                    setQueryName(queryName)
                })
                .catch((err: any) => { console.error(err) })
        }
    }, [])




    return (
        <Card>
            
            {selectedHsps && 
            <>
                <div className="flex justify-between">
                <h1 className="font-bold text-lg">HSP #{selectedHsps?.id} for query {queryName}</h1>
                <div className="flex gap-4 items-center w-1/4 mt-2">
                    <Input
                        isClearable
                        classNames={{
                            inputWrapper: "border-1",
                        }}
                        placeholder="Search for sequence..."
                        size="md"
                        width={72}
                        startContent={<Search />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue("")}
                        onValueChange={onSearchChange}
                    />
                </div>
                </div>

            <div className="mt-6 flex gap-4">
            <Chip variant="flat" color="primary">Expected value {selectedHsps.evalue}</Chip>
            <Chip variant="flat" color="primary">Score {selectedHsps.score}</Chip>
            <Chip variant="flat" color="primary">Bit score {selectedHsps.bitScore}</Chip>
            <Chip variant="flat" color="primary">Gaps {selectedHsps.gaps}</Chip>
            <Chip variant="flat" color="primary">Length {selectedHsps.alignLength}</Chip>
            </div>
            
                <div className="flex text-bold text-medium capitalize mt-8">
                    <div className="flex gap-2">
                        <div className="flex flex-col justify-between w-auto">
                            <p className="text-blue-600 mr-2">Q{1 + (page - 1) * displayedLetters}</p>
                            <p className="text-green-600 mr-2">H{1 + (page - 1) * displayedLetters}</p>
                        </div>
                        <div className="flex flex-wrap gap-y-10">
                        {Array(displayedLetters).fill(0).map((_, i) => {
                            return (
                                <div key={i} className="flex flex-col justify-between text-wrap">
                                    <NucleotideLetter highlighted={QueryBackgroundSearch(i)}>{selectedHsps?.qseq.charAt(currIndex(i))}</NucleotideLetter>
                                    <span className="text-center">{selectedHsps?.midline.charAt(currIndex(i))}</span>
                                    <NucleotideLetter highlighted={HitsBackgroundSearch(i)}>{selectedHsps?.hseq.charAt(currIndex(i))}</NucleotideLetter>
                                </div>
                            )
                        })
                        }
                        </div>
                        <div className="flex flex-col justify-between w-auto">
                            <p className="text-blue-600 mr-2">{displayedLetters + (page - 1) * displayedLetters}</p>
                            <p className="text-green-600 mr-2">{displayedLetters + (page - 1) * displayedLetters}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center mt-8">
    
              <Pagination 
                key="key" 
                total={Math.ceil(selectedHsps.qseq?.length / displayedLetters)} 
                onChange={(page) => setPage(page)}
                initialPage={1} 
                page={page}
                size="md" 
                classNames={{
                    cursor: "text-background",
                }} 
                />
            
          </div>
            </>
            
            }
        </Card>
    )
}