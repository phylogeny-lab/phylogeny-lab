"use client";

import { Button } from '@mui/material';
import { FormikValues } from 'formik';
import React from 'react'

interface Props {
    hasPrevious?: boolean;
    onBackClick: (values: FormikValues) => void;
    isLastStep: boolean;
    finalStep: string;
}

function FormNavigation(props: Props) {
  return (
    <div className='flex mt-8 content-between justify-between items-center mx-6'>
        {props.hasPrevious ? 
            <Button variant="contained" type="button" className=' bg-gray-400' onClick={props.onBackClick}>
                Back
            </Button>
            :
            <div></div>
        }

        <Button type="submit" color="primary" variant="contained">
            {props.isLastStep ? props.finalStep : 'Next'}
        </Button>
    </div>
  )
}

export default FormNavigation