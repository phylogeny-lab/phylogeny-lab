import { BASE_URL } from '@/app/consts/consts';
import { ToastFail, ToastSuccess } from '@/utils/Toast';
import { Card } from '@nextui-org/react';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React from 'react'
import * as yup from 'yup';
import FormTextField from '../../FormField/FormTextField';
import FormSelectField from '../../FormField/FormSelectField';
import FormFileUpload from '../../FormField/FormFileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormButtonGroup from '../../FormField/FormButtonGroup';
import FormCheckboxField from '../../FormField/FormCheckboxField';
import { Button } from '@mui/material';

function MuscleForm() {

  const router = useRouter()

  const validationSchema = yup.object({

  })

  const onSubmit = (async (data: any) => {

    const { 'infile': inFile, ...newData } = data;

    let formData = new FormData();

    formData.append('data', JSON.stringify(newData))
    formData.append('infile', inFile)

    await axios.post(BASE_URL + `/alignment/muscle`, formData,
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
        input: '',
        inSequence: '',
        consiters: 2,
        refineiters: 100,
        perm: 'None',
        outformat: 'AFA',
        perturb: 0,
        threads: 4,
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

          <Card style={{padding: '2rem'}}>
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
                      <FormSelectField color='info' name="outformat" options={['CLUSTAL', 'FASTA', 'PHYLIP', 'NEXUS', 'PIR', 'GCG', 'GDE']} />
                    </div>
                  </div>


                  <div className='mt-3'>

                    <h1 className='mb-2 font-light'>Enter FASTA sequence(s)</h1>
                    <FormTextField
                      label="FASTA file"
                      name="inSequence"
                      multiline={true}
                      rows={9}
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

              </div>

              <div className='w-1/2 px-2 h-full'>

                <div className=' flex-col justify-between'>
                  <h2 className='mt-3 font-semibold text-lg text-gray-400 mb-2'>Alignment parameters</h2>
                  <div className='flex gap-16 content-center items-center'>

                    {/* <div>
                      <h2 className='mt-3 font-light text-medium mb-2'>Molecule type</h2>
                      <FormButtonGroup name="type" options={['NT', 'AMINO']} />
                    </div> */}

                  </div>


                  <div className='flex gap-8 w-full mt-6'>
                    <FormTextField type='number' label='consiters' name="consiters" />
                    <FormTextField type='number' name="refineiters" label="Refinement iterations" />
                  </div>

                  <div className='flex gap-8 w-full mt-6'>
                    <FormTextField type='number' label='Threads' name="threads" />
                    <FormTextField type='number' name="perturb" label="Seed/perturb" />
                  </div>

                </div>


                <div className='w-full justify-end flex mt-24'>
                  <Button color='primary' variant='contained' type='submit' >Run Muscle</Button>
                </div>

              </div>
            </div>
          </Card>


        </Form>
      )}
    </Formik>
  )
}

export default MuscleForm