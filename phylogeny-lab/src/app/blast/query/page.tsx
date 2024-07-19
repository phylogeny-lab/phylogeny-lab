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
    const [searchSensitivity, setSearchSensitivity] = useState("Normal")

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

        const getDatabases = (async () => {

            await axios.get(BASE_URL + '/blastdb/installed')
            .then(((response: any) => { 
                const res = response.data
                setInstalledDatabases(new Set(res.map((item: any) => (item.dbname))))
            }))
            .catch((err: any) => { console.error(err) })
        })

        getDatabases()
        

    }, []);


    const SubmitQuery = (data: any) => {

        const { 'subjectFile': subjectFile, 'queryFile': queryFile, ...newData } = data;

        let formData = new FormData();

        formData.append('data', JSON.stringify(newData))
        formData.append('subjectFile', subjectFile)
        formData.append('queryFile', queryFile)

        axios.post(BASE_URL + `/blast/${data.algorithm}`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((response) => {
                console.log(response);

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
                    perc_id: 70,
                    max_hsps: 1,
                    querySequence: '',
                    queryFile: '',
                    entrezQuery: '',
                    subjectSequence: '',
                    subjectFile: '',
                    description: '',
                    reward: 1,
                    penalty: -1,
                    gapopen: 3,
                    gapextend: 2,
                    dbFile: '',
                    evalue: 10,
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
                    <div className='mt-16 p-4'>
                        <h1 className='mt-6 font-semibold text-gray-400 '>New BLAST job</h1>
                        <div className='mt-6 flex gap-2 items-top content-top align-top'>

                            <div>
                                <FormSelectField name='algorithm' options={['blastn', 'blastp', 'blastx']} />
                            </div>

                            <div className='w-full'>
                                <FormTextField name="jobTitle" label="Job title" />
                            </div>
                        </div>

                        <div className='mt-8'>
                            <h1 className='font-semibold text-gray-400  mb-2'>Enter FASTA sequence(s), or NCBI accession</h1>
                            <FormTextField
                                label="FASTA file"
                                name="querySequence"
                                multiline={true}
                                rows={10}
                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setQuerySequenceInput(true) : setQuerySequenceInput(false)}
                            />
                        </div>

                        <div className='mt-6'>
                            <h1 className='font-semibold text-gray-400  mb-2'>Or upload a file</h1>
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
                    <div className='mt-16 p-4'>
                        <div className='flex gap-8'>

                            <div className='w-1/2 h-auto'>
                                <div className='w-full'>
                                    <h1 className='mb-2 font-semibold text-gray-400 mt-6'>Choose Database</h1>
                                    {installedDatabases.size > 0 ? <FormComboboxField
                                        name='db'
                                        fullWidth={true}
                                        id='databases_combo'
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setDbInput(true) : setDbInput(false)}
                                        disabled={subjectFileInput || subjectSequenceInput}
                                        options={Array.from(installedDatabases)}
                                    /> : <p>No databases found</p>}

                                </div>

                                <div className='w-full'>
                                    <h1 className='font-semibold text-gray-400  mb-4 mt-6'>Or enter subject FASTA sequence(s)</h1>
                                    <FormTextField
                                        label="FASTA file"
                                        name="subjectSequence"
                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => e.target.value ? setSubjectSequenceInput(true) : setSubjectSequenceInput(false)}
                                        multiline={true}
                                        rows={11}
                                    />

                                    <h1 className='font-semibold text-gray-400  mb-4 mt-6'>Or upload a file</h1>
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

                                <h1 className='mb-2 mt-6 font-semibold text-gray-400 '>Organism</h1>
                                <div className='flex'>
                                    <FormTextField
                                        name="organism"
                                        label="Organism (optional)"
                                    />

                                </div>

                                <h1 className='mb-2 font-semibold text-gray-400 mt-6'>Limit query</h1>
                                <div className='w-full'>
                                    <FormTextField
                                        name="entrezQuery"
                                        label="Entrez Query (optional)"
                                    />
                                </div>

                                <h1 className='mb-2 font-semibold text-gray-400 mt-6'>Tax IDs</h1>
                                <div className='w-full'>
                                    <FormTextField
                                        name="taxids"
                                        label="Tax ids (optional)"
                                    />
                                </div>

                                <h1 className='mb-2 font-semibold text-gray-400 mt-6'>Description</h1>
                                <div className='w-full'>
                                    <FormTextField
                                        name="description"
                                        label="Description (optional)"
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

                    <div className='mt-16 p-4 flex justify-between content-center gap-8'>

                        <div className='w-full'>

                            <h1 className='font-semibold text-gray-400  mb-4'>Search sensitivity</h1>
                            <FormRadioField 
                                label="Search sensitivity" 
                                name="searchSensitivity" 
                                row={true} 
                                default={searchSensitivity}
                                options={['Near match', 'Short sequences', 'Normal', 'Distant homologies']} 
                            />

                            <h1 className='font-semibold text-gray-400 mb-4 mt-6'>General</h1>
                            <div className='w-full'>

                                <div className='w-full flex justify-between gap-2'>
                                    <FormTextField label="Word size" type='number' name='word_size' />
                                    <FormTextField label="Max HSPS" type='number' name='max_hsps' />
                                </div>

                                <div className='w-full flex justify-between gap-2 mt-6'>
                                    <FormTextField label="Percent identity" type='number' name='perc_id' />
                                    <FormTextField label="Expected value" type='number' name='evalue' />
                                </div>

                            </div>
                        </div>


                        <div className='w-full'>
                            <h1 className='font-semibold text-gray-400 mb-4'>Scoring options</h1>
                            <div className='w-full mt-6'>

                                <div className='flex justify-between gap-2 w-full'>
                                    <FormTextField name='reward' label="reward" type="number" />
                                    <FormTextField name='penalty' label="penalty" type="number" />
                                </div>

                                <div className='flex justify-between gap-2 w-full mt-6'>
                                    <FormTextField name='gapopen' label="Existence" type="number" />
                                    <FormTextField name='gapextend' label="Extension" type="number" />
                                </div>

                                <div className='flex gap-2 content-center items-center mt-2'>
                                <div className='text-center'>Ungapped</div>
                                <FormCheckboxField name='ungapped'/>
                                </div>
                            </div>

                            <h1 className='font-semibold text-gray-400 mb-4 mt-6'>Masking options</h1>
                            <div className='w-full flex gap-2 content-center items-center'>
                            <div className='text-center'>Filter low complexity</div>
                            <FormCheckboxField name='filterLowComplexity' />
                            </div>
                        </div>

                    </div>
                </FormStep>
            </MultiStepForm>
        </div>
    )
}

export default BlastQuery

