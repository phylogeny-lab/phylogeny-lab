"use client";

import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup';
import FormTextField from '@/app/Components/FormField/FormTextField';
import FormFileUpload from '@/app/Components/FormField/FormFileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormButtonGroup from '@/app/Components/FormField/FormButtonGroup';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Button } from '@mui/material';
import { BASE_URL } from '@/app/consts/consts';
import axios from 'axios';
import { ToastFail, ToastSuccess } from '@/utils/Toast';
import { useRouter } from 'next/navigation';

interface Props {
    setCurrentTask: React.Dispatch<React.SetStateAction<string>>
    resetJobs: any;
}

function DimensionalityReductionForm({ setCurrentTask, resetJobs }: Props) {

    const [sequenceInput, setSequenceInput] = useState(false)

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const router = useRouter()

    const validationSchema = yup.object({

    })

    const onSubmit = (async (data: any) => {

        const { 'sequenceFile': sequenceFile, ...newData } = data;

        let formData = new FormData();

        formData.append('data', JSON.stringify(newData))
        formData.append('sequenceFile', sequenceFile)

        await axios.post(BASE_URL + `/pca`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res: any) => {
                ToastSuccess("Running PCA");
                setCurrentTask(res.data.task_id);
                resetJobs();
            }).catch((err: any) => {
                ToastFail(`Error ${err}`);
            })

    })


    return (
        <>
            <Button variant='contained' onClick={onOpen}>New Job</Button>

            <Formik
                initialValues={{
                    title: '',
                    sequenceFile: '',
                    sequences: '',
                    batch_size: 100,
                    kmers: 3,
                    algorithm: 'PCA',
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>
                {({
                    setFieldValue,
                    setFieldTouched,
                    values,
                    errors,
                    touched,
                }) => (
                    

                        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <Form>
                                        <ModalHeader className="flex flex-col gap-1">Dimensionality reduction</ModalHeader>
                                        <ModalBody>


                                            <div className='mt-3'>
                                                <FormTextField
                                                    name='title'
                                                    label="Descriptive title"
                                                />
                                            </div>

                                            <div className='mt-3'>

                                                <h1 className='mb-2 font-light'>Enter FASTA sequence(s)</h1>
                                                <FormTextField
                                                    label="FASTA file"
                                                    name="sequences"
                                                    multiline={true}
                                                    rows={7}
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setSequenceInput(true) : setSequenceInput(false)}
                                                />

                                                <h2 className='mt-3 font-light text-medium mb-2'>Or upload FASTA file</h2>
                                                <FormFileUpload
                                                    label='Upload'
                                                    name='sequenceFile'
                                                    key={'sequence'}
                                                    icon={<CloudUploadIcon />}>
                                                    Upload
                                                </FormFileUpload>
                                            </div>



                                            <div className='w-full flex gap-6 mt-4'>
                                                <div>
                                                    <h2 className='font-light text-medium mb-2'>Kmers</h2>
                                                    <FormTextField label="Kmers" type='number' name="kmers" />
                                                </div>

                                                <div>
                                                    <h2 className='font-light text-medium mb-2'>Batch size</h2>
                                                    <FormTextField label="Batch size" type='number' name="batch_size" />
                                                </div>
                                            </div>

                                            <div className='w-full mt-2'>

                                                <div>
                                                    <h2 className='mt-3 font-light text-medium mb-2'>Algorithm</h2>
                                                    <FormButtonGroup name="algorithm" options={['PCA', 'UMAP', 'tSNE']} />
                                                </div>

                                            </div>

                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="error" onClick={onClose}>
                                                Close
                                            </Button>
                                            <Button color="primary" variant='contained' type='submit' onClick={onClose}>
                                                Run
                                            </Button>
                                        </ModalFooter>
                                    </Form>
                                )}
                            </ModalContent>
                        </Modal>

                )}
            </Formik>


        </>
    )
}

export default DimensionalityReductionForm