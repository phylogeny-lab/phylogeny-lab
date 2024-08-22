"use client";

import { Card } from '@nextui-org/react';
import React, { useState } from 'react'
import MultiStepForm, { FormStep } from '../Components/Blast/BlastQuery/MultiStepForm/MultiStepForm';
import * as yup from 'yup'
import axios from 'axios';
import { BASE_URL } from '../consts/consts';
import { ToastFail, ToastSuccess } from '@/utils/Toast';
import FormFileUpload from '../Components/FormField/FormFileUpload';
import FormTextField from '../Components/FormField/FormTextField';
import FormSelectField from '../Components/FormField/FormSelectField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormCheckboxField from '../Components/FormField/FormCheckboxField';
import FormButtonGroup from '../Components/FormField/FormButtonGroup';
import FormLabel from '../Components/Blast/BlastQuery/Stepper/FormLabel';

function MrBayes() {

  const validationSchema = yup.object({

  })

  const SubmitQuery = async (data: any) => {
    const { 'sequenceFile': sequenceFile, ...newData } = data;

    let formData = new FormData();

    formData.append('data', JSON.stringify(newData))
    formData.append('sequenceFile', sequenceFile)

    await axios.post(BASE_URL + `/alignment/mrbayes`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res: any) => {
        ToastSuccess("Alignment started")
        //router.push('/alignment')
      }).catch((err: any) => {
        ToastFail(`Error ${err}`)
      })
  }

  const [formikValues, setFormikValues] = useState<any>(null)

  return (
    <Card className='dark' style={{ padding: '1rem', background: 'var(--bg-primary)', marginLeft: '10rem', marginRight: '10rem', paddingTop: '2rem' }}>
      <MultiStepForm
        setFormikValues={setFormikValues}
        initialValues={{
          //data
          jobTitle: '',
          sequenceFile: '',
          sequence: '',
          //lset
          nucmodel: '4by4', //4by4, Doublet, Codon, Protein
          nst: '1', //1, 2, 6, Mixed
          code: 'Universal', // Universal, Vertmt, Invermt, Yeast, Mycoplasma, Ciliate, Echinoderm, Euplotid, Metmt
          ploidy: 'Diploid', // Haploid, Diploid, Zlinked
          rates: 'Equal', // Equal, Gamma, LNorm, Propinv, Invgamma, Adgamma, Kmixture
          ngammacat: 4,
          nlnormcat: 4,
          nmixtcat: 4,
          nbetacat: 5,
          omegavar: 'Equal', // Equal, Ny98, M3
          covarion: false,
          coding: 'All', // All, Variable, Informative, Nosingletons, Noabsencesites, Nopresencesites, Nosingletonabsence, Nosingletonpresence
          statefrmod: 'Stationary', // Stationary, Directional, Mixed
          parsmodel: false,
          //prset
          tratioprOpt: 'Beta', tratioprVal: '(1.0,1.0)',
          revmatprOpt: 'Dirichlet', revmatprVal: '(1.0,1.0,1.0,1.0,1.0,1.0)',
          aamodelprOpt: 'Fixed', aamodelprVal: '(Poisson)',
          aarevmatprOpt: 'Dirichlet', aarevmatprVal: '(1.0,1.0,...)',
          omegaprOpt: 'Dirichlet', OmegaprVal: '(1.0,1.0)',
          ny98omega1prOpt: 'Beta', Ny98omega1prVal: '(1.0,1.0)',
          ny98omega3prOpt: 'Exponential', Ny98omega3prVal: '(1.0)',
          m3omegapr: 'Exponential',
          codoncatfreqsOpt: 'Dirichlet', codoncatfreqsVal: '(1.0,1.0,1.0)',
          statefreqprOpt: 'Dirichlet', statefreqprVal: '(1.0,1.0,1.0,1.0)',
          shapeprOpt: 'Exponential', shapeprVal: '(1.0)',
          ratecorrprOpt: 'Uniform', RatecorrprVal: '(-1.0,1.0)',
          pinvarprOpt: 'Uniform', pinvarprVal: '(0.0,1.0)',
          covswitchprOpt: 'Uniform', CovswitchprVal: '(0.0,100.0)',
          symdirihyperprOpt: 'Fixed', symdirihyperprVal: '(Infinity)',
          topologypr: 'Uniform',
          brlensprOpt: 'Unconstrained:GammaDir', brlensprVal: '(1.0,0.100,1.0,1.0)',
          treeageprOpt: 'Gamma', treeageprVal: '(1.00,1.00)',
          speciationprOpt: 'Exponential', speciationprVal: '(10.0)',
          extinctionprOpt: 'Beta', extinctionprVal: '(1.0,1.0)',
          fossilizationprOpt: 'Beta', fossilizationprVal: '(1.0,1.0)',
          sampleStrat: 'Random',
          sampleprob: 1.00,
          popsizeprOpt: 'Gamma', popsizeprVal: '(1.0,10.0)',
          popvarpr: 'Equal',
          nodeagepr: 'Unconstrained',
          clockrateprOpt: 'Fixed', clockrateprVal: '(1.00)',
          clockvarpr: 'Strict',
          cpprateprOpt: 'Exponential', cpprateprVal: '(0.10)',
          cppmultdevprOpt: 'Fixed', cppmultdevprVal: '(0.40)',
          TK02varprOpt: 'Exponential', TK02varprVal: '(1.00)',
          WNvarprOpt: 'Exponential', WNvarprVal: '(10.00)',
          IGRvarprOpt: 'Exponential', IGRvarprVal: '(1.00)',
          ILNvarprOpt: 'Exponential', ILNvarprVal: '(1.00)',
          mixedvarprOpt: 'Exponential', mixedvarprVal: '(1.00)',
          ratepr: 'Fixed',
          generatepr: 'Fixed',
          //analysis
          ngen: 1000000,
          nruns: 2,
          nchains: 4,
          temp: 0.100,
          reweight: '0.0,0.0',
          swapfreq: 1,
          nswaps: 1,
          samplefreq: 500,
          printfreq: 1000,
          printall: 'yes',
          printmax: 8,
          mcmcdiagn: 'yes',
          diagnfreq: 5000,
          diagnstat: 'Avgstddev',
          minpartfreq: 0.10,
          allchains: 'no',
          allcomps: 'no',
          relburnin: 'yes',
          burnin: 0,
          burninfrac: 0.25,
          stoprule: 'No',
          stopval: 0.05,
          startparams: 'Current',
          starttree: 'Current',
          nperts: 0,
          data: 'yes',
          ordertaxa: 'No',
          append: 'No',
          autotune: 'yes',
          tunefreq: 1000
        }}
        onSubmit={values => {
          SubmitQuery(values)
        }}
        validationSchema={validationSchema}
      >
        <FormStep
          stepName="Sequence data"
          onSubmit={() => console.log('step 1 submit')}
          validationSchema={validationSchema}
        >
          {/* FIRST PAGE - Sequences */}

          <div className=' mt-6 p-4'>
            <h1 className='mt-6 font-semibold text-gray-400 '>Data</h1>
            <div className='mt-6'>

              <div className='w-full'>
                <FormTextField name="jobTitle" label="Job title" />
              </div>
            </div>

            <div className='mt-8'>
              <h1 className='font-semibold text-gray-400  mb-2'>Enter FASTA sequence(s), or NCBI accession</h1>
              <FormTextField
                label="FASTA file"
                name="sequence"
                multiline={true}
                rows={10}
                disabled={typeof (formikValues?.sequenceFile) === "object"} //need to fix!
              />
            </div>

            <div className='mt-6'>
              <h1 className='font-semibold text-gray-400  mb-2'>Or upload a file</h1>
              <FormFileUpload
                disabled={formikValues?.sequence}
                label='Upload'
                name='sequenceFile'
                icon={<CloudUploadIcon />}>
                Upload
              </FormFileUpload>
            </div>
          </div>

        </FormStep>

        <FormStep
          stepName="Model parameters"
          onSubmit={(data: any) => console.log(data)}
          validationSchema={validationSchema}
        >
          {/* SECOND PAGE - lset */}

          <div className='grid grid-cols-3 mt-8'>

          <div>

            <div>
              <FormLabel help='help'>Nucmodel</FormLabel>
              <FormButtonGroup name='nucmodel' options={['4by4', 'Doublet', 'Codon', 'Protein']} label='nucmodel' />
            </div>

            <div>
              <h3 className='text-gray-400 font-light mb-2 mt-5'>Nst</h3>
              <FormButtonGroup name='nst' options={['1', '2', '6', 'Mixed']} label='nst' />
            </div>

            <div>
              <h3 className='text-gray-400 font-light mb-2 mt-5'>Code</h3>
              <FormSelectField name='code' options={['Universal', 'Vertmt', 'Invermt', 'Yeast', 'Mycoplasma', 'Ciliate', 'Echinoderm', 'Euplotid', 'Metmt']} />
            </div>

            <div>
              <h3 className='text-gray-400 font-light mb-2 mt-5'>Ploidy</h3>
              <FormButtonGroup name='ploidy' options={['Haploid', 'Diploid', 'Zlinked']} label='Ploidy' />
            </div>

          </div>

          <div>

            <div>
              <h3 className='text-gray-400 font-light mb-2 mt-5'>Rates</h3>
              <FormSelectField name='rates' options={['Equal', 'Gamma', 'LNorm', 'Propinv', 'Invgamma', 'Adgamma', 'Kmixture']} />
            </div>

            <div>
              <h3 className='text-gray-400 font-light mb-2 mt-5'>Omegavar</h3>
              <FormButtonGroup name='omegavar' options={['Equal', 'Ny98', 'M3']} label='Omegavar' />
            </div>

            <div>
              <h3 className='text-gray-400 font-light mb-2 mt-5'>Covarion</h3>
              <FormCheckboxField name='covarion' label='Covarion' />
            </div>

          </div>

          <div>

          <div>
            <h3 className='text-gray-400 font-light mb-2 mt-5'>Coding</h3>
            <FormSelectField name='coding' options={['All', 'Variable', 'Informative', 'Nosingletons', 'Noabsencesites', 'Nopresencesites', 'Nosingletonabsence', 'Nosingletonpresence']} />
          </div>

          <div>
            <h3 className='text-gray-400 font-light mb-2 mt-5'>Statefrmod</h3>
            <FormButtonGroup name='statefrmod' options={['Stationary', 'Directional', 'Mixed']} label='Statefrmod' />
          </div>

          <div>
            <h3 className='text-gray-400 font-light mb-2 mt-5'>Parsmodel</h3>
            <FormCheckboxField name='parsmodel' label='Parsmodel' />
          </div>

          </div>

          </div>

        </FormStep>

        <FormStep
          stepName="Priors"
          onSubmit={() => console.log('Step 2 submit')}
        >


        </FormStep>

        <FormStep
          stepName="Analysis"
          onSubmit={() => console.log('Step 2 submit')}
        >


        </FormStep>
      </MultiStepForm>
    </Card>
  )
}

export default MrBayes