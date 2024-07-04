"use client";

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as yup from 'yup';
import FormTextField from '@/app/Components/FormField/FormTextField';
import MultiStepForm, { FormStep } from '@/app/Components/Blast/BlastQuery/MultiStepForm/MultiStepForm';
import FormSelectField from '@/app/Components/FormField/FormSelectField';
import FormRadioField from '@/app/Components/FormField/FormRadioField';
import FormDiscreteSliderField from '@/app/Components/FormField/FormDiscreteSliderField';
import FormFileUpload from '@/app/Components/FormField/FormFileUpload';
import { useRouter } from 'next/navigation';
import FormCheckboxField from '@/app/Components/FormField/FormCheckboxField';
import FormComboboxField from '@/app/Components/FormField/FormComboboxField';

function BlastQuery() {

    // flags to disable other input type
    const [querySequenceInput, setQuerySequenceInput] = useState(false)
    const [queryFileInput, setQueryFileInput] = useState(false)

    const [subjectSequenceInput, setSubjectSequenceInput] = useState(false)
    const [subjectFileInput, setSubjectFileInput] = useState(false)

    const [dbInput, setDbInput] = useState(false)

    const validationSchema = yup.object({
        jobTitle: yup.string().required('Job title is required'),
        querySequence: yup.string().when('queryFile', ([], schema) => {
            return queryFileInput ? schema.notRequired() : schema.required("Query sequence required if query file not provided.");
        }),
    })

    const validationSchema2 = yup.object({
        subjectSequence: yup.string().when('subjectFile', ([], schema) => {
                return subjectFileInput ? schema.notRequired() : schema.required("Either subject or database required.")
        })
    })

    const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_ENDPOINT

    const [installedDatabases, setInstalledDatabases] = useState<Set<string>>(new Set(["test"]))

    const router = useRouter();

    useEffect(() => {

        // await axios.get(BASE_URL + '/blastdb/ncbi')
        //     .then(((response: any) => { 
        //         const res = response.data
        //         alert(JSON.stringify(Array.from(new Set(res.map((item: any) => (item.dbname))))))
        //         setInstalledDatabases(new Set(res.map((item: any) => (item.dbname))))
        //     }))
        //     .catch((err: any) => { console.error(err) })

    }, []);


    const SubmitQuery = (data: any) => {

        const { 'subjectFile': subjectFile, 'queryFile': queryFile, ...newData } = data;

        let formData = new FormData();

        formData.append('data', JSON.stringify(newData))
        formData.append('subjectFile', subjectFile)
        formData.append('queryFile', queryFile)

        alert("Submitting")

        axios.post(BASE_URL + `/blast/${data.algorithm}`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                console.log(response);

                alert(response.data.task_id)
                router.push('/blast')

            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className='w-full px-60'>
            <MultiStepForm
                initialValues={{
                    jobTitle: '',
                    algorithm: 'blastn',
                    db: '',
                    taxids: '',
                    perc_identity: 70,
                    max_hsps: 1,
                    querySequence: '',
                    queryFile: '',
                    entrezQuery: '',
                    subjectSequence: '',
                    subjectFile: '',
                    reward: 1,
                    penalty: -1,
                    gapopen: 3,
                    gapextend: 2,
                    dbFile: '',
                    evalue: 0.05,
                    word_size: 7,
                    ungapped: false,
                    organism: '',
                }}
                onSubmit={values => {
                    SubmitQuery(values)
                }}
                validationSchema={validationSchema}
            >
                <FormStep
                    stepName="Query Sequence"
                    onSubmit={() => console.log('step 1 submit')}
                    validationSchema={validationSchema}
                >
                    {/* FIRST PAGE - Query Sequence */}
                    <div className='mt-6 p-4'>
                        <h1 className='mt-6 font-bold'>Algorithm</h1>
                        <div className='mt-6 flex gap-2 items-top content-top align-top'>

                            <div>
                                <FormSelectField name='algorithm' label=" " options={['blastn', 'blastp', 'blastx']}/>
                            </div>

                            <div className='w-3/4'>
                                <FormTextField name="jobTitle" label="Job title"/>
                            </div>
                        </div>

                        <div className='mt-8'>
                            <h1 className=' font-bold mb-2'>Enter FASTA sequence(s)</h1>
                            <FormTextField
                                label="FASTA file"
                                name="querySequence"
                                multiline={true}
                                rows={6}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setQuerySequenceInput(true) : setQuerySequenceInput(false)}
                            />
                        </div>

                        <div className='mt-6'>
                            <h1 className=' font-bold mb-2'>Or upload a file</h1>
                            <FormFileUpload
                                disabled={querySequenceInput}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setQueryFileInput(true) : setQueryFileInput(false)}
                                label='Upload'
                                name='queryFile'
                                setInput={setQueryFileInput}
                                icon={<CloudUploadIcon />}>
                                    Upload Sequence
                                </FormFileUpload>
                        </div>
                    </div>

                </FormStep>

                <FormStep
                    stepName="Search set"
                    onSubmit={(data: any) => console.log(data)}
                    validationSchema={validationSchema2}
                >
                    {/* SECOND PAGE - Search set */}
                    <div className='mt-6 p-4'>
                        <div className='flex gap-8'>

                            <div className='w-1/2 h-auto'>
                                <div className='w-full'>
                                    <h1 className='mb-2 font-bold'>Database</h1>
                                    {installedDatabases.size > 0 ? <FormComboboxField
                                        name='db'
                                        fullWidth={true}
                                        id='databases_combo'
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setDbInput(true) : setDbInput(false)}
                                        disabled={subjectFileInput || subjectSequenceInput}
                                        options={Array.from(installedDatabases)}
                                    /> : <p>No databases found</p>}
                                    
                                </div>

                                <div className='w-full h-full'>
                                    <h1 className=' font-bold mb-2'>Or enter subject FASTA sequence(s)</h1>
                                    <FormTextField
                                        label="FASTA file"
                                        name="subjectSequence"
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setSubjectSequenceInput(true) : setSubjectSequenceInput(false)}
                                        multiline={true}
                                        rows={6}
                                    />

                                    <h1 className=' font-bold mb-2'>Or upload a file</h1>
                                    <FormFileUpload
                                        disabled={querySequenceInput}
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setSubjectFileInput(true) : setSubjectFileInput(false)}
                                        label='Upload'
                                        name='subjectFile'
                                        setInput={setSubjectFileInput}
                                        icon={<CloudUploadIcon />} >
                                            Sequence file
                                        </FormFileUpload>
                                </div>

                            </div>

                        <div className='w-1/2'>

                            <h1 className='mb-2 mt-6 font-bold'>Organism</h1>
                            <div className='flex'>
                                <FormTextField
                                    name="organism"
                                    label="Organism (optional)"
                                />

                            </div>

                            <h1 className='mb-2 font-bold mt-6'>Limit query</h1>
                            <div className='w-full'>
                                <FormTextField
                                    name="entrezQuery"
                                    label="Entrez Query (optional)"
                                />
                            </div>

                            <h1 className='mb-2 font-bold mt-6'>Tax IDs</h1>
                            <div className='w-full'>
                                <FormTextField
                                    name="taxids"
                                    label="Tax ids (optional)"
                                />
                            </div>
                        </div>
                        </div>
                    </div>
                </FormStep>

                <FormStep
                    stepName="Refine blast parameters"
                    onSubmit={() => console.log('Step 2 submit')}
                >
                    <div className='w-1/4 mt-8'>
                        <FormTextField
                            label="Expected value"
                            type='number'
                            name='evalue'
                        />
                    </div>

                    <div className='w-1/4 mt-8'>
                        <FormTextField
                            label="Max HSPS"
                            type='number'
                            name='max_hsps'
                        />
                    </div>

                    <div className='w-1/3 mt-8'>
                    {/* [defaultValue, min, max, step] */}
                        <FormDiscreteSliderField
                            step={1}
                            min={4}
                            max={64}
                            id='word_size_slider'
                            value={70}
                            name="word_size"
                        />
                    </div>

                    <div className='w-1/3 mt-8'>
                    {/* [defaultValue, min, max, step] */}
                        <FormDiscreteSliderField
                            value={70}
                            min={1}
                            max={100}
                            step={5}
                            name="perc_identity"
                            id='perc_identity_slider'
                        />
                    </div>

                    <h1 className='mt-8 font-bold'>Match/Mismatch</h1>
                    <div className='my-8 flex justify-between gap-4 w-1/2'>
                        <FormTextField name='reward' label="reward"/>
                        <FormTextField name='penalty' label="penalty"/>
                    </div>

                    <h1 className='mt-8 font-bold'>Gap costs</h1>
                    <div className='my-8 flex justify-between gap-4 w-1/2'>
                        <FormTextField name='gapopen' label="Existence"/>
                        <FormTextField name='gapextend' label="Extension"/>
                    </div>
                    <h1 className='font-bold mt-8'>Ungapped</h1>
                    <FormCheckboxField name='ungapped' />
                </FormStep>
            </MultiStepForm>
        </div>
    )
}

export default BlastQuery

