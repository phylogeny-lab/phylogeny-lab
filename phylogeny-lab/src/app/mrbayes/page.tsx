"use client";

import { Card } from '@nextui-org/react';
import React, { useState } from 'react'
import MultiStepForm, { FormStep } from '../Components/Blast/BlastQuery/MultiStepForm/MultiStepForm';
import * as yup from 'yup'
import { FormikProps, FormikValues } from 'formik';

function MrBayes() {

  const validationSchema = yup.object({
    
})

  const SubmitQuery = (values: any) => {

  }

  const [formik, setFormik] = useState<any>(null)
  
  return (
    <Card className='dark' style={{padding: '1rem', background: 'var(--bg-primary)', marginLeft: '10rem', marginRight: '10rem', paddingTop: '2rem' }}>
            <MultiStepForm
                setFormikState={setFormik}
                initialValues={{
                    //data
                    jobTitle: '',
                    sequenceFile: '',
                    sequence: '',
                    //lset
                    nucmodel: '4by4',
                    nst: 1,
                    code: 'universal',
                    ploidy: 'diploid',
                    rates: 'equal',
                    ngammacat: 4,
                    nlnormcat: 4,
                    nmixtcat: 4,
                    nbetacat: 5,
                    omegavar: 'equal',
                    covarion: 'No',
                    coding: 'all',
                    statefrmod: 'stationary',
                    parsmodel: 'no',
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
                    
                    {JSON.stringify(formik)}

                </FormStep>

                <FormStep
                    stepName="Model settings"
                    onSubmit={(data: any) => console.log(data)}
                    validationSchema={validationSchema}
                >
                    {/* SECOND PAGE - lset */}
                    
                </FormStep>

                <FormStep
                    stepName="Prior Settings"
                    onSubmit={() => console.log('Step 2 submit')}
                >

                    
                </FormStep>

                <FormStep
                    stepName="Analysis Settings"
                    onSubmit={() => console.log('Step 2 submit')}
                >

                    
                </FormStep>
            </MultiStepForm>
        </Card>
  )
}

export default MrBayes