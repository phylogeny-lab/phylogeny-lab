import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup';
import FormTextField from '../../FormField/FormTextField';
import FormFileUpload from '../../FormField/FormFileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormCheckboxField from '../../FormField/FormCheckboxField';
import FormButtonGroup from '../../FormField/FormButtonGroup';
import FormSelectField from '../../FormField/FormSelectField';
import { Button } from '@mui/material';
import { SiAccenture } from "react-icons/si";
import Card from '../../Card/Card';
import { BASE_URL } from '@/app/consts/consts';
import axios from 'axios';
import { ToastFail, ToastSuccess } from '@/utils/Toast';
import { useRouter } from 'next/navigation';

function ClustalwForm() {

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
                jobTitle: '',
                bootstrap: 1000,
                infile: '',
                inSequence: '',
                type: 'DNA',
                matrix: 'BLOSUM',
                matrixfile: '',
                dnamatrix: 'IUB',
                dnamatrixfile: '',
                gapopen: 10,
                gapext: 0.20,
                kimura: true,
                output: 'CLUSTAL',
                outputtree: 'NJ',
                outorder: 'INPUT',
                numiter: 3,
                clustering: 'NJ',
                //maxseqlen: '',
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
                
                <Card style="">
                <div className='w-full flex justify-between gap-8 h-full'>
                    <div className='w-1/2 px-2 h-full'>
                        <div className='w-full'>
                            <h2 className='mt-2 font-semibold text-gray-400 text-lg mb-2'>General</h2>
                            <div className='flex content-center items-center gap-2 mt-6'>
                                <FormTextField
                                    name='jobTitle'
                                    label="Alignment job title"
                                />
                                <div className=''>
                                    <FormSelectField color='info' name="output" options={['CLUSTAL', 'FASTA', 'PHYLIP', 'NEXUS', 'PIR', 'GCG', 'GDE']} />
                                </div>
                            </div>
                            

                            <div className='mt-3'>

                                <h1 className='mb-2 font-light'>Enter FASTA sequence(s)</h1>
                                <FormTextField
                                    label="FASTA file"
                                    name="inSequence"
                                    multiline={true}
                                    rows={9}
                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setSequenceInput(true) : setSequenceInput(false)}
                                />

                                <h2 className='mt-3 font-light text-medium mb-2'>Or upload unaligned sequences</h2>
                                <FormFileUpload
                                    label='Upload'
                                    name='infile'
                                    key={'sequence'}
                                    icon={<CloudUploadIcon />}>
                                    Upload
                                </FormFileUpload>
                            </div>
                        </div>

                        <h2 className='mt-6 font-semibold text-gray-400 text-lg mb-2'>Tree parameters</h2>
                        <div className='w-full mt-2 flex gap-16'>

                            <div>
                            <h2 className='mt-3 font-light text-medium mb-2'>Clustering algorithm</h2>
                            <FormButtonGroup name="clustering" options={['NJ', 'UPGMA']} />
                            </div>

                            <div>
                            <h2 className='mt-3 font-light text-medium mb-2'>Output tree format</h2>
                            <FormButtonGroup name="outputtree" options={['NJ', 'PHYLIP', 'DIST', 'NEXUS']} />
                            </div>
                            
                        </div>
                        <div className='mt-6'>
                        <FormCheckboxField name="kimura" label="Use Kimura's correction"/>
                        </div>
                    </div>

                    <div className='w-1/2 px-2 h-full'>

                        <div className=' flex-col justify-between'>
                        <h2 className='mt-3 font-semibold text-lg text-gray-400 mb-2'>Alignment parameters</h2>
                        <div className='flex gap-16 content-center items-center'>
                            
                            <div>
                            <h2 className='mt-3 font-light text-medium mb-2'>Molecule type</h2>
                            <FormButtonGroup name="type" options={['DNA', 'PROTEIN']} />
                            </div>

                            <div>
                            <h2 className='mt-3 font-light text-medium mb-2'>Output order</h2>
                            <FormButtonGroup name="outorder" options={['INPUT', 'ALIGNED']} />
                            </div>
                        </div>

                        <h2 className='mt-6 font-light text-medium mb-3'>Gap penalties</h2>
                        <div className='flex gap-8 w-full'>
                            <FormTextField type='number' label='Gap open' name="gapopen" />
                            <FormTextField type='number' name="gapopen" label="gap extension" />
                        </div>

                        <div className='flex gap-8 w-full mt-6'>
                            <FormTextField type='number' label='Num iterations' name="numiter" />
                            <FormTextField type='number' name="bootstrap" label="Bootstrap" />
                        </div>

                        <h2 className='mt-3 font-light text-medium'>Matrix</h2>
                        {values.type === 'DNA' ? 
                        <div className='mt-3'>
                            <FormButtonGroup name="dnamatrix" options={['IUB', 'CLUSTALW']} />
                            <h2 className='font-light text-medium mb-2 mt-6'>Or DNA matrix file</h2>
                                <FormFileUpload
                                    label='Upload'
                                    name='dnamatrixfile'
                                    key={'sequence'}
                                    icon={<CloudUploadIcon />}>
                                    Upload
                                </FormFileUpload>
                        </div>
                        :
                        <div className='mt-6'>
                            <FormButtonGroup name="matrix" options={['BLOSUM', 'PAM', 'GONNET']} />
                            <h2 className='mt-3 font-light text-medium mb-2'>Or amino acid matrix file</h2>
                                <FormFileUpload
                                    label='Upload'
                                    name='matrixfile'
                                    key={'sequence'}
                                    icon={<CloudUploadIcon />}>
                                    Upload
                                </FormFileUpload>
                        </div>
                        }
                        </div>

                        
                        <div className='w-full justify-end flex mt-24'>
                        <Button color='primary' variant='contained' type='submit' >Run Clustalw</Button>
                        </div>
 
                    </div>
                </div>
                </Card>


            </Form>
          )}
        </Formik>
    )
}

export default ClustalwForm