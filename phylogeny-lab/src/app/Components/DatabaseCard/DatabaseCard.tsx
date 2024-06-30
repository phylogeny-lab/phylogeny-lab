"use client";

import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { FaDatabase, FaInfo, FaVirusCovid } from 'react-icons/fa6';
import { genusIconMap, speciesIconMap } from '@/data/databasemock';
import {Accordion, AccordionItem} from "@nextui-org/react";
import {Divider} from "@nextui-org/react";
import Link from 'next/link';
import GenomeAvatar from '../GenomeAvatar/GenomeAvatar';

interface Props {
    dataRow: DatabaseDisplayTable;
    genus: string;
    species: string;
  }

function DatabaseCard({ dataRow, genus, species }: Props) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const organismNameArr = dataRow.organism_name.split(' ')

    return (

        <>
            <Button
                color="secondary"
                startIcon={ <FaInfo /> } 
                onClick={onOpen}
                >
                  More info
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="dark" style={{ height: '65vh', position: 'absolute', overflow: 'scroll' }}>
                <ModalContent>
                    {(onClose) => (
                        <div>

                            <ModalHeader className="flex flex-col gap-1 lowercase text-center mt-4">

                                <div className='width-full flex justify-center'>
                                    <GenomeAvatar width="6rem" height="6rem" database={dataRow} genus={genus} species={species} />
                                </div>

                                <div className='flex gap-2 justify-center content-center'>

                                    {organismNameArr.length > 3 ?
                                    <h1 className='light'>{dataRow.organism_name}</h1>
                                     :
                                    <>
                                    <h1 className='capitalize italic text-center'>{genus}</h1>
                                    <h1 className=' text-gray-500 light font-thin italic'>{organismNameArr[organismNameArr.length - 1]}</h1>
                                    </>
                                    }
                                    
                                    
                                </div>
                                
                            </ModalHeader>
                            <ModalBody>

                                <Accordion defaultExpandedKeys={["1"]} selectionMode='multiple'>

                                <AccordionItem key="1" aria-label="summary" title="Summary">

                                <Divider className="mb-2" />
                                <p className='light font-thin'>
                                    Submitter: {dataRow.submitter || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Assembly: {dataRow.assembly_name || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Assembly level: {dataRow.assembly_level || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Database accession: {dataRow.accession || '-'}
                                </p>
                                </AccordionItem>


                                <AccordionItem key="2" aria-label='assembly_info' title="Assembly info">
                                <Divider className="mb-2" />
                                <p className='light font-thin'>
                                    Assembly type: {dataRow.assembly_type || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Bioproject accession: {dataRow.bioproject_accession || '-'}
                                </p>
                                </AccordionItem>

                                <AccordionItem key="3" aria-label='sequence_info' title="Sequence info">
                                <Divider className="mb-2" />
                                <p className='light font-thin'>
                                    GC count: {dataRow.gc_count || '-'}
                                </p>
                                <p className='light font-thin'>
                                    GC content: { `${dataRow.gc_percent}%` || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Contigs: {dataRow.number_of_contigs || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Number of organelles: {dataRow.number_of_organelles || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Number of scaffolds: {dataRow.number_of_scaffolds || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Sequence length: {dataRow.total_sequence_length || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Ungapped sequence length: {dataRow.total_ungapped_length || '-'}
                                </p>
                                </AccordionItem>

                                <AccordionItem key="4" aria-label='gene_info' title="Gene info">
                                <Divider className="mb-2" />
                                <p className='light font-thin'>
                                    Protein coding genes: {dataRow.protein_coding_genes || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Non-coding genes: {dataRow.non_coding_genes || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Pseudogenes: {dataRow.pseudogenes || '-'}
                                </p>
                                <p className='light font-thin'>
                                    Total genes: {dataRow.total_genes || '-'}
                                </p>
                                </AccordionItem>

                                </Accordion>
                                
                            
                                
                            </ModalBody>
                            <ModalFooter>
                                <Button color='inherit' onClick={onClose}>
                                    Close
                                </Button>
                                <Button color="info" onClick={onClose}>
                                    <Link rel='noreferrer' target='_blank' href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${dataRow.tax_id}/`}>Explore NCBI</Link>
                                </Button>
                            </ModalFooter>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
export default DatabaseCard