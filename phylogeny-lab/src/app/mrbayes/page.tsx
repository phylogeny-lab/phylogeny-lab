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
import { lsetHelpMenu, mcmcHelpMenu, prsetHelpMenu } from "../consts/mrbayesHelpMenu";

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
    <Card className='dark' style={{ padding: '1rem', background: 'var(--bg-primary)', marginLeft: '1rem', marginRight: '1rem', paddingTop: '2rem' }}>
      <MultiStepForm
        finalStep='Run Mr Bayes'
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
          tratiopr: ['Beta', '(1.0,1.0)'], // Beta, Fixed
          revmatpr: ['Dirichlet', '(1.0,1.0,1.0,1.0,1.0,1.0)'], // Dirichlet, Fixed
          aamodelpr: ['Fixed', '(Poisson)'], // Fixed, Mixed
          aarevmatpr: ['Dirichlet', '(1.0,1.0,...)'], // Dirichlet, Fixed
          omegapr: ['Dirichlet', '(1.0,1.0)'], // Dirichlet, Fixed
          ny98omega1pr: ['Beta', '(1.0,1.0)'], // Beta, Fixed
          ny98omega3pr: ['Exponential', '(1.0)'], // Uniform, Exponential, Fixed
          m3omegapr: 'Exponential', // Exponential, Fixed
          codoncatfreqs: ['Dirichlet', '(1.0,1.0,1.0)'], // Dirichlet, Fixed
          statefreqpr: ['Dirichlet', '(1.0,1.0,1.0,1.0)'], // Dirichlet, Fixed
          shapepr: ['Exponential', '(1.0)'], // Uniform, Exponential, Fixed
          ratecorrpr: ['Uniform', '(-1.0,1.0)'], // Uniform, Fixed
          pinvarpr: ['Uniform', '(0.0,1.0)'], // Uniform, Fixed
          covswitchpr: ['Uniform', '(0.0,100.0)'], // Uniform, Exponential, Fixed
          symdirihyperpr: ['Fixed', '(Infinity)'], // Uniform, Exponential, Fixed
          topologypr: 'Uniform', // Uniform, Constraints, Fixed, Speciestree
          brlenspr: ['Unconstrained', '(1.0,0.100,1.0,1.0)'], // Unconstrained, Clock, Fixed
          treeagepr: ['Gamma', '(1.00,1.00)'], // Gamma, Uniform, Fixed, Truncatednormal, Lognormal, Offsetlognormal, Offsetgamma, Offsetexponential
          speciationpr: ['Exponential', '(10.0)'], // Uniform, Exponential, Fixed
          extinctionpr: ['Beta', '(1.0,1.0)'], // Beta, Fixed
          fossilizationpr: ['Beta', '(1.0,1.0)'], // Beta, Fixed
          sampleStrat: 'Random', // Random, Diversity, Cluster, FossilTip
          sampleprob: 1.00,
          popsizepr: ['Gamma', '(1.0,10.0)'], // Lognormal, Gamma, Uniform, Normal, Fixed
          popvarpr: 'Equal', // Equal, Variable
          nodeagepr: 'Unconstrained', // Unconstrained, Calibrated
          clockratepr: ['Fixed', '(1.00)'], // Fixed, Normal, Lognormal, Exponential, Gamma
          clockvarpr: 'Strict', // Strict, Cpp, TK02, WN, IGR, ILN
          cppratepr: ['Exponential', '(0.10)'], // Fixed, Exponential
          cppmultdevpr: ['Fixed', '(0.40)'], // Fixed
          TK02varpr: ['Exponential', '(1.00)'], // Fixed, Exponential, Uniform
          WNvarpr: ['Exponential', '(10.00)'], // Fixed, Exponential, Uniform
          IGRvarpr: ['Exponential', '(1.00)'], // Fixed, Exponential, Uniform
          ILNvarpr: ['Exponential', '(1.00)'], // Fixed, Exponential, Uniform
          mixedvarpr: ['Exponential', '(1.00)'], // Fixed, Exponential, Uniform
          ratepr: ['Fixed', '(1.00)'], // Fixed, Variable, Dirichlet
          generatepr: ['Fixed', '(1.00)'], // Fixed, Variable, Dirichlet
          //mcmc
          ngen: 1000000,
          nruns: 2,
          nchains: 4,
          temp: 0.100,
          reweight: '0.0,0.0',
          swapfreq: 1,
          nswaps: 1,
          samplefreq: 500,
          mcmcdiagn: true,
          diagnfreq: 5000,
          diagnstat: 'Avgstddev', // Avgstddev, Maxstddev
          minpartfreq: 0.10,
          allchains: false,
          allcomps: false,
          relburnin: true,
          burnin: 0,
          burninfrac: 0.25,
          stoprule: false,
          stopval: 0.05,
          startparams: 'Current', // Current, Reset
          starttree: 'Current', // Current, Random, Parsimony
          nperts: 0,
          data: true,
          ordertaxa: false,
          append: false,
          autotune: true,
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

          <div className='flex justify-between gap-8'>

            <div className=' mt-6 p-4 w-full'>
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

            <div className='w-full flex justify-between gap-8 mt-6'>
            <div>

              <div>
                <FormLabel help={lsetHelpMenu.nucmodel.description}>Nucmodel</FormLabel>
                <FormButtonGroup name='nucmodel' options={['4by4', 'Doublet', 'Codon', 'Protein']} label='nucmodel' />
              </div>

              <div>
                <FormLabel help={lsetHelpMenu.nst.description}>Nst</FormLabel>
                <FormButtonGroup name='nst' options={['1', '2', '6', 'Mixed']} label='nst' />
              </div>

              <div>
                <FormLabel help={lsetHelpMenu.code.description}>Code</FormLabel>
                <FormSelectField size="small" variant="filled" name='code' options={['Universal', 'Vertmt', 'Invermt', 'Yeast', 'Mycoplasma', 'Ciliate', 'Echinoderm', 'Euplotid', 'Metmt']} />
              </div>

              <div>
                <FormLabel help={lsetHelpMenu.ploidy.description}>Ploidy</FormLabel>
                <FormButtonGroup name='ploidy' options={['Haploid', 'Diploid', 'Zlinked']} label='Ploidy' />
              </div>

              <div>
                <FormLabel help={lsetHelpMenu.rates.description}>Rates</FormLabel>
                <FormSelectField size="small" variant="filled" name='rates' options={['Equal', 'Gamma', 'LNorm', 'Propinv', 'Invgamma', 'Adgamma', 'Kmixture']} />
              </div>

              

            </div>

            <div>

              <div>
                <FormLabel help={lsetHelpMenu.omegavar.description}>Omegavar</FormLabel>
                <FormButtonGroup name='omegavar' options={['Equal', 'Ny98', 'M3']} label='Omegavar' />
              </div>

              <div>
                <FormLabel help={lsetHelpMenu.covarion.description}>Covarion</FormLabel>
                <FormCheckboxField name='covarion' label='Covarion' />
              </div>

              <div>
                <FormLabel help={lsetHelpMenu.coding.description}>Coding</FormLabel>
                <FormSelectField size="small" variant="filled" name='coding' options={['All', 'Variable', 'Informative', 'Nosingletons', 'Noabsencesites', 'Nopresencesites', 'Nosingletonabsence', 'Nosingletonpresence']} />
              </div>

              <div>
                <FormLabel help={lsetHelpMenu.statefrmod.description}>Statefrmod</FormLabel>
                <FormButtonGroup name='statefrmod' options={['Stationary', 'Directional', 'Mixed']} label='Statefrmod' />
              </div>

              <div>
                <FormLabel help={lsetHelpMenu.parsmodel.description}>Parsmodel</FormLabel>
                <FormCheckboxField name='parsmodel' label='Parsmodel' />
              </div>

            </div>

            </div>

          </div>

        </FormStep>

        <FormStep
          stepName="Priors"
          onSubmit={() => console.log('Step 2 submit')}
        >

          {/* Third page */}

          <div className='flex justify-between gap-16 mx-4 h-[40rem] overflow-y-scroll mt-8'>

            <div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.tratiopr.description}>Tratiopr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='tratiopr[0]' options={['Beta', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='tratiopr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.revmatpr.description}>Revmatpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='revmatpr[0]' options={['Dirichlet', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='revmatpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.aamodelpr.description}>Aamodelpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='aamodelpr[0]' options={['Fixed', 'Mixed']} />
                  <FormTextField size='small' variant='filled' name='aamodelpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.aarevmatpr.description}>Aarevmatpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='aarevmatpr[0]' options={['Dirichlet', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='aarevmatpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.omegapr.description}>Omegapr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='omegapr[0]' options={['Dirichlet', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='omegapr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.ny98omega1pr.description}>Ny98omega1pr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='ny98omega1pr[0]' options={['Beta', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='ny98omega1pr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.ny98omega3pr.description}>Ny98omega3pr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='ny98omega3pr[0]' options={['Uniform', 'Exponential', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='ny98omega3pr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.m3omegapr.description}>M3omegapr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='m3omegapr' options={['Exponential', 'Fixed']} />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.codoncatfreqs.description}>Codoncatfreqs</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='codoncatfreqs[0]' options={['Dirichlet', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='codoncatfreqs[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.statefreqpr.description}>Statefreqpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='statefreqpr[0]' options={['Dirichlet', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='statefreqpr[1]' />
                </div>
              </div>

            </div>

            <div>







              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.shapepr.description}>Shapepr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='shapepr[0]' options={['Uniform', 'Exponential', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='shapepr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.ratecorrpr.description}>Ratecorrpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='ratecorrpr[0]' options={['Uniform', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='ratecorrpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.pinvarpr.description}>Pinvarpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='pinvarpr[0]' options={['Uniform', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='pinvarpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.covswitchpr.description}>Covswitchpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='covswitchpr[0]' options={['Uniform', 'Exponential', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='covswitchpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.symdirihyperpr.description}>Symdirihyperpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='symdirihyperpr[0]' options={['Uniform', 'Exponential', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='symdirihyperpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.topologypr.description}>Topologypr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormSelectField name='topologypr' options={['Uniform', 'Constraints', 'Fixed', 'Speciestree']} />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.brlenspr.description}>Brlenspr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='brlenspr[0]' options={['Unconstrained', 'Clock', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='brlenspr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.treeagepr.description}>Treeagepr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormSelectField name='treeagepr[0]' options={['Gamma', 'Uniform', 'Fixed', 'Truncatednormal', 'Lognormal', 'Offsetlognormal', 'Offsetgamma', 'Offsetexponential']} />
                  <FormTextField size='small' variant='filled' name='treeagepr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.speciationpr.description}>Speciationpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='speciationpr[0]' options={['Uniform', 'Exponential', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='speciationpr[1]' />
                </div>
              </div>

            </div>

            <div>







              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.extinctionpr.description}>Extinctionpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='extinctionpr[0]' options={['Beta', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='extinctionpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.fossilizationpr.description}>Fossilizationpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='fossilizationpr[0]' options={['Beta', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='fossilizationpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.sampleStrat.description}>Samplestrat</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='sampleStrat' options={['Random', 'Diversity', 'Cluster', 'FossilTip']} />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.sampleprob.description}>Sampleprob</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormTextField name='sampleprob' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.popsizepr.description}>Popsizepr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormSelectField name='popsizepr[0]' options={['Lognormal', 'Gamma', 'Uniform', 'Normal', 'Fixed']} />
                  <FormTextField size='small' variant='filled' name='popsizepr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.popvarpr.description}>Popvarpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='popvarpr' options={['Equal', 'Variable']} />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.nodeagepr.description}>Nodeagepr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='nodeagepr' options={['Unconstrained', 'Calibrated']} />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.clockratepr.description}>Clockratepr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormSelectField name='clockratepr[0]' options={['Fixed', 'Normal', 'Lognormal', 'Exponential', 'Gamma']} />
                  <FormTextField size='small' variant='filled' name='clockratepr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.clockvarpr.description}>Clockvarpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='clockvarpr' options={['Strict', 'Cpp', 'TK02', 'WN', 'IGR', 'ILN']} />
                </div>
              </div>

            </div>

            <div>













              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.cppratepr.description}>Cppratepr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='cppratepr[0]' options={['Fixed', 'Exponential']} />
                  <FormTextField size='small' variant='filled' name='cppratepr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.cppmultdevpr.description}>Cppmultdevpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='cppmultdevpr[0]' options={['Fixed']} />
                  <FormTextField size='small' variant='filled' name='cppmultdevpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.TK02varpr.description}>TK02varpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='TK02varpr[0]' options={['Fixed', 'Exponential', 'Uniform']} />
                  <FormTextField size='small' variant='filled' name='TK02varpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.WNvarpr.description}>WNvarpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='WNvarpr[0]' options={['Fixed', 'Exponential', 'Uniform']} />
                  <FormTextField size='small' variant='filled' name='WNvarpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.IGRvarpr.description}>IGRvarpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='IGRvarpr[0]' options={['Fixed', 'Exponential', 'Uniform']} />
                  <FormTextField size='small' variant='filled' name='IGRvarpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.ILNvarpr.description}>ILNvarpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='ILNvarpr[0]' options={['Fixed', 'Exponential', 'Uniform']} />
                  <FormTextField size='small' variant='filled' name='ILNvarpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel>Mixedvarpr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='mixedvarpr[0]' options={['Fixed', 'Exponential', 'Uniform']} />
                  <FormTextField size='small' variant='filled' name='mixedvarpr[1]' />
                </div>
              </div>

              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.ratepr.description}>Ratepr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='ratepr[0]' options={['Fixed', 'Variable', 'Dirichlet']} />
                  <FormTextField size='small' variant='filled' name='ratepr[1]' />
                </div>
              </div>



              <div >
                <div className='justify-center'>
                  <FormLabel help={prsetHelpMenu.generatepr.description}>Generatepr</FormLabel>
                </div>
                <div className='flex items-center gap-4'>
                  <FormButtonGroup name='generatepr[0]' options={['Fixed', 'Variable', 'Dirichlet']} />
                  <FormTextField size='small' variant='filled' name='generatepr[1]' />
                </div>
              </div>

            </div>


          </div>

        </FormStep>

        <FormStep
          stepName="Analysis"
          onSubmit={() => console.log('Step 2 submit')}
        >

          {/* Fourth page */}

          <div className='flex justify-between gap-16 mx-4 h-[40rem] overflow-y-scroll mt-8'>

            <div>

              <div>
                <FormLabel help={mcmcHelpMenu.ngen.description}>Ngen</FormLabel>
                <FormTextField type='number' name='ngen' label='Ngen' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.nruns.description}>Nruns</FormLabel>
                <FormTextField type='number' name='nruns' label='Nruns' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.stopval.description}>Stopval</FormLabel>
                <FormTextField type='number' name='stopval' label='Stopval' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.nchains.description}>Nchains</FormLabel>
                <FormTextField type='number' name='nchains' label='Nchains' />
              </div>



            </div>

            <div>

              <div>
                <FormLabel help={mcmcHelpMenu.temp.description}>Temp</FormLabel>
                <FormTextField type='number' name='temp' label='Temp' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.reweight.description}>Reweight</FormLabel>
                <FormTextField name='reweight' label='Reweight' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.swapfreq.description}>Swapfreq</FormLabel>
                <FormTextField type='number' name='swapfreq' label='Swapfreq' />
              </div>


              <div>
                <FormLabel help={mcmcHelpMenu.nswaps.description}>Nswaps</FormLabel>
                <FormTextField type='number' name='nswaps' label='Nswaps' />
              </div>




            </div>

            <div>

              <div>
                <FormLabel help={mcmcHelpMenu.samplefreq.description}>Samplefreq</FormLabel>
                <FormTextField type='number' name='samplefreq' label='Samplefreq' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.mcmcdiagn.description}>Mcmcdiagn</FormLabel>
                <FormCheckboxField name='mcmcdiagn' label='Mcmcdiagn' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.diagnfreq.description}>Diagnfreq</FormLabel>
                <FormTextField type='number' name='diagnfreq' label='Diagnfreq' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.diagnstat.description}>Diagnstat</FormLabel>
                <FormButtonGroup name='diagnstat' label='Diagnstat' options={['Avgstddev', 'Maxstddev']} />
              </div>


              <div>
                <FormLabel help={mcmcHelpMenu.minpartfreq.description}>Minpartfreq</FormLabel>
                <FormTextField type='number' name='minpartfreq' label='Minpartfreq' />
              </div>





            </div>
            <div>

              <div>
                <FormLabel help={mcmcHelpMenu.allchains.description}>Allchains</FormLabel>
                <FormCheckboxField name='allchains' label='Allchains' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.allcomps.description}>Allcomps</FormLabel>
                <FormCheckboxField name='allcomps' label='Allcomps' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.relburnin.description}>Relburnin</FormLabel>
                <FormCheckboxField name='relburnin' label='Relburnin' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.burnin.description}>Burnin</FormLabel>
                <FormTextField type='number' name='burnin' label='Burnin' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.burninfrac.description}>Burninfrac</FormLabel>
                <FormTextField type='number' name='burninfrac' label='Burninfrac' />
              </div>





            </div>

            <div>

              <div>
                <FormLabel help={mcmcHelpMenu.stoprule.description}>Stoprule</FormLabel>
                <FormCheckboxField name='stoprule' label='Stoprule' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.startparams.description}>Startparams</FormLabel>
                <FormButtonGroup name='startparams' label='Startparams' options={['Current', 'Reset']} />
              </div>


              <div>
                <FormLabel help={mcmcHelpMenu.starttree.description}>Starttree</FormLabel>
                <FormButtonGroup name='starttree' label='Starttree' options={['Current', 'Random', 'Parsimony']} />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.nperts.description}>Nperts</FormLabel>
                <FormTextField type='number' name='nperts' label='Nperts' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.data.description}>Data</FormLabel>
                <FormCheckboxField name='data' label='Data' />
              </div>





            </div>

            <div>

              <div>
                <FormLabel help={mcmcHelpMenu.ordertaxa.description}>Ordertaxa</FormLabel>
                <FormCheckboxField name='ordertaxa' label='Ordertaxa' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.append.description}>Append</FormLabel>
                <FormCheckboxField name='append' label='Append' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.autotune.description}>Autotune</FormLabel>
                <FormCheckboxField name='autotune' label='Autotune' />
              </div>

              <div>
                <FormLabel help={mcmcHelpMenu.tunefreq.description}>Tunefreq</FormLabel>
                <FormTextField type='number' name='tunefreq' label='Tunefreq' />
              </div>

            </div>



          </div>

        </FormStep>
      </MultiStepForm>
    </Card>
  )
}

export default MrBayes