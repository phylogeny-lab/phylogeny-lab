"use client";

import React, { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, DropdownItem } from "@nextui-org/react";
import { Avatar, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { FaInfoCircle } from 'react-icons/fa';
import { Formik, useFormik, Form } from 'formik';
import { TextField } from "@mui/material";
import FormFileUpload from '../FormField/FormFileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormTextField from '../FormField/FormTextField';
import axios, { AxiosError } from 'axios';
import * as yup from 'yup';
import { BASE_URL } from '@/app/consts/consts';
import { toast } from 'react-toastify';
import { ToastSuccess, ToastFail } from '@/utils/Toast';

interface Props {
    height?: string;
    width?: string;
    children?: React.ReactNode;
    closeModal?: any;
}

function CustomDatabaseModalContent({ height, width, closeModal, children }: Props) {

    const validationSchema = yup.object({
        sequenceFile: yup.object().required('Sequence file required'),
        dbname: yup.string().required('Database name required'),
    })

    const onSubmit = (async (data: any) => {
        const { 'sequenceFile': sequenceFile, ...newData } = data;

        let formData = new FormData();

        formData.append('data', JSON.stringify(newData))
        formData.append('sequenceFile', sequenceFile)

        await axios.post(BASE_URL + `/blastdb/custom`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                console.log(response);
                closeModal()
                ToastSuccess("Successfully added database")
            })
            .catch((err: AxiosError) => {
                console.error(err.message);
                if(err.status === 409) {
                    ToastFail("Database name not unique")
                }
                else {
                    ToastFail("Couldn't add database")
                }
            });
    })

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1 text-center">Create a custom database</ModalHeader>
                    <ModalBody>

                    <Formik 
                        initialValues={{ 
                            sequenceFile: '', 
                            dbname: '',
                            chromosomes: '',
                            taxid: '',
                            databaseID: '',
                            databaseSource: '',
                            tags: ''

                        }} 
                        validationSchema={validationSchema} 
                        onSubmit={onSubmit}>
                    <Form>

                            <FormTextField
                                name='dbname'
                                label="Database name/organism"
                                placeholder='e.g. Drosophilia melanogaster'
                                
                            />
                        
                            <div className='mt-3'>
                            <FormFileUpload
                                label='Upload'
                                name='sequenceFile'
                                key={'sequence'}
                                icon={<CloudUploadIcon />}>
                                    Sequence file
                                </FormFileUpload>
                            </div>

                            <h2 className='mt-3 font-semibold text-gray-400 text-medium'>Optional fields</h2>

                            <div className='flex justify-between gap-2 mt-3'>
                            <FormTextField
                                name='chromosomes'
                                label="No of chromosomes"
                                placeholder='e.g. 24'
                                
                            />

                            <FormTextField
                                name='taxid'
                                label="Taxonomy ID"
                                placeholder='e.g. 9606'
                                
                            />
                            </div>

                            <div className='mt-3 flex justify-between gap-2'>
                            <FormTextField
                                name='databaseID'
                                label="Identifier/accession"
                                placeholder='e.g. GC_0000045.21'
                                
                            />

                            <FormTextField
                                name='databaseSource'
                                label="Source database"
                                placeholder='e.g. Genbank'
                                
                            />
                            </div>

                            <div className='mt-3'>
                            <FormTextField
                                name='tags'
                                label="Tags"
                                placeholder='Separate tags with comma or space'
                                
                            />
                            </div>


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

export default CustomDatabaseModalContent