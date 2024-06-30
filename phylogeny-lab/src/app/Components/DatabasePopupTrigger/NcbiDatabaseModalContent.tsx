"use client";

import React, { useState } from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, DropdownItem} from "@nextui-org/react";
import { Avatar, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import * as yup from 'yup';
import { BASE_URL } from '@/app/consts/consts';
import { Form, Formik } from 'formik';
import FormTextField from '../FormField/FormTextField';

interface Props {
    height?: string;
    width?: string;
    children?: React.ReactNode;
}

function NcbiDatabaseModalContent({ height, width, children }: Props) {

    const [taxon, setTaxon] = useState("")
    const [accession, setAccession] = useState("")

    const validationSchema = yup.object({
        accession: yup.string().when('accession', ([], schema) => {
            return taxon ? schema.notRequired() : schema.required("Either NCBI accession or taxon is required.");
        }),
        taxon: yup.string().when('taxon', ([], schema) => {
            return accession ? schema.notRequired() : schema.required("Either NCBI accession or taxon is required.")
        })
    })

    const onSubmit = (async (databases: any) => {
        
        const data = {
            databases: Array.from(databases)
        }

        await axios.post(BASE_URL + '/blastdb/ncbi', data)
        .then((res: any) => {
            console.log(res.data)
        })
        .catch((err: any) => {
            console.error(err)
        })
    })

    return (
        <ModalContent>
        {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1">Databases</ModalHeader>
                <ModalBody>
                    
                    <Formik initialValues={{ accession: '', taxon: '' }} validationSchema={validationSchema} onSubmit={onSubmit}>
                    <Form>

                        <FormTextField
                        name="accession"
                        label="Accession string"
                        placeholder='e.g. GCA_000002165.1'
                        onInput={(e: any) => setAccession(e.target.value)}
                        />

                        <FormTextField
                        name="taxon"
                        label="Taxon"
                        placeholder='e.g. 9606, chondrichthyes'
                        onInput={(e: any) => setTaxon(e.target.value)}
                        />
                    </Form>

                    </Formik>
                </ModalBody>
                <ModalFooter>
                    <Button color='inherit' onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </>
        )}
    </ModalContent>
    )
}

export default NcbiDatabaseModalContent