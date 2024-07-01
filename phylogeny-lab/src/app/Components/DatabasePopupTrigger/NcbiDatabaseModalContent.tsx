"use client";

import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, DropdownItem } from "@nextui-org/react";
import { Avatar, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import * as yup from 'yup';
import { BASE_URL } from '@/app/consts/consts';
import { Form, Formik } from 'formik';
import FormTextField from '../FormField/FormTextField';
import { ToastFail, ToastInfo, ToastSuccess } from '@/utils/Toast';

interface Props {
    height?: string;
    width?: string;
    children?: React.ReactNode;
    closeModal?: any;
}

function NcbiDatabaseModalContent({ height, width, children, closeModal }: Props) {

    const [taxon, setTaxon] = useState("")
    const [accession, setAccession] = useState("")

    const validationSchema = yup.object({
        accession: yup.string().required("Either NCBI accession or taxon is required."),
    })

    const onSubmit = (async (databases: any) => {

        await axios.post(BASE_URL + '/blastdb/ncbi', [databases])
            .then((res: any) => {
                console.log(res.data)
                closeModal()
                ToastSuccess("Successfully added database")
            })
            .catch((err: any) => {
                console.error(err)
                if (err.status === 409) {
                    ToastInfo("Database name not unique")
                }
                else {
                    ToastFail("Couldn't add database")
                }
            })
    })

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Databases</ModalHeader>
                    <ModalBody>

                        <Formik
                            initialValues={{ accession: '' }}
                            validationSchema={validationSchema} 
                            onSubmit={onSubmit}>
                            <Form>

                                <FormTextField
                                    name="accession"
                                    label="Accession or Taxonomy ID"
                                    placeholder='e.g. GCA_000002165.1'
                                    onInput={(e: any) => setAccession(e.target.value)}
                                />

                                <ModalFooter className='px-0'>
                                    <Button color='info' type='submit'>
                                        Create
                                    </Button>

                                </ModalFooter>

                            </Form>

                        </Formik>
                    </ModalBody>

                </>
            )}
        </ModalContent>
    )
}

export default NcbiDatabaseModalContent