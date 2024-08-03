"use client";

import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup';
import FormTextField from '@/app/Components/FormField/FormTextField';
import FormFileUpload from '@/app/Components/FormField/FormFileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormButtonGroup from '@/app/Components/FormField/FormButtonGroup';
import { Button } from '@mui/material';
import { Card } from '@nextui-org/react';
import { BASE_URL } from '@/app/consts/consts';
import axios from 'axios';
import { ToastFail, ToastSuccess } from '@/utils/Toast';
import { useRouter } from 'next/navigation';

function DimensionalityReductionForm() {

    const [sequenceInput, setSequenceInput] = useState(false)
    const router = useRouter()

    const validationSchema = yup.object({

    })

    const onSubmit = (async (data: any) => {

        const { 'infile': inFile, 'matrixfile': matrixFile, 'dnamatrixfile': dnaMatrixFile, ...newData } = data;

        let formData = new FormData();

        formData.append('data', JSON.stringify(newData))
        formData.append('infile', inFile)
        formData.append('matrixfile', matrixFile)
        formData.append('dnamatrixfile', dnaMatrixFile)

        await axios.post(BASE_URL + `/alignment/clustalw`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res: any) => {
                ToastSuccess("Alignment started")
                router.push('/alignment')
            }).catch((err: any) => {
                ToastFail(`Error ${err}`)
            })

    })


    return (
        <Formik
            initialValues={{
                title: '',
                infile: '',
                sequences: '',
                batchSize: 8,
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
                <Form>

                    <Card className='dark' style={{padding: '1rem', background: 'var(--bg-primary)' }}>

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
                                rows={8}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setSequenceInput(true) : setSequenceInput(false)}
                            />

                            <h2 className='mt-3 font-light text-medium mb-2'>Or upload FASTA file</h2>
                            <FormFileUpload
                                label='Upload'
                                name='infile'
                                key={'sequence'}
                                icon={<CloudUploadIcon />}>
                                Upload
                            </FormFileUpload>
                        </div>



                        <div className='w-1/2 flex gap-6'>
                            <div>
                                <h2 className='mt-3 font-light text-medium mb-2'>Kmers</h2>
                                <FormTextField label="Kmers" type='number' name="kmers" />
                            </div>

                            <div>
                                <h2 className='mt-3 font-light text-medium mb-2'>Batch size</h2>
                                <FormTextField label="Batch size" type='number' name="batchSize" />
                            </div>
                        </div>

                        <div className='w-full mt-2'>

                            <div>
                                <h2 className='mt-3 font-light text-medium mb-2'>Algorithm</h2>
                                <FormButtonGroup name="algorithm" options={['PCA', 'UMAP', 'tSNE']} />
                            </div>

                        </div>



                        <div className='w-full flex justify-end'>
                            <Button variant='contained'>Run</Button>
                        </div>



                    </Card>


                </Form>
            )}
        </Formik>
    )
}

export default DimensionalityReductionForm