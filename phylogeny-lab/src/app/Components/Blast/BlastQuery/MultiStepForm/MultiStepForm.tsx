"use client";

import { Form, Formik, FormikConfig, FormikHelpers, FormikProps, FormikValues } from 'formik';
import React, { SetStateAction, useState } from 'react'
import FormNavigation from '../FormNavigation/FormNavigation';
import { StepLabel, Stepper, Step } from '@mui/material';

interface Props extends FormikConfig<FormikValues> {
    children: React.ReactNode;
    setFormikValues: React.Dispatch<SetStateAction<any>>;
    finalStep: string;
}

function MultiStepForm({ children, initialValues, onSubmit, setFormikValues, finalStep }: Props) {

    const [stepNumber, setStepNumber] = useState(0);
    const steps = React.Children.toArray(children) as React.ReactElement[]

    const [snapshot, setSnapshot] = useState(initialValues)
    const step = steps[stepNumber];
    const totalSteps = steps.length;
    const isLastStep = stepNumber === totalSteps - 1;

    const next = (values: FormikValues) => {
        setSnapshot(values)
        setStepNumber(stepNumber + 1)
    }

    const previous = (values: FormikValues) => {
        setSnapshot(values)
        setStepNumber(stepNumber - 1)
    }

    const handleSubmit = async (values: FormikValues, actions: FormikHelpers<FormikValues>) => {
        if (step.props.onSubmit) {
            await step.props.onSubmit(values)
        }

        if (isLastStep) {
            return onSubmit(values, actions);
        }
        else {
            actions.setTouched({});
            next(values)
        }
    }

    return (
        <div className='w-full'>
            <Formik initialValues={snapshot} onSubmit={handleSubmit} validationSchema={step.props.validationSchema}>
                {(formik) => {
                    setFormikValues(formik.values);
                    return (
                        <Form onSubmit={formik.handleSubmit}>

                            <Stepper activeStep={stepNumber} sx={{paddingLeft: '5rem', paddingRight: '5rem'}}>
                                {steps.map(currentStep => {
                                    const label = currentStep.props.stepName;
                                    return <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                })}
                            </Stepper>
                            {step}
                            <FormNavigation
                                isLastStep={isLastStep}
                                hasPrevious={stepNumber > 0}
                                onBackClick={() => previous(formik.values)}
                                finalStep={finalStep}
                            />
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default MultiStepForm

export const FormStep = ({ stepName = '', children }: any) => children;