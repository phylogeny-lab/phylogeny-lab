"use client";

import { FieldConfig, FieldHookConfig, useField, useFormikContext } from 'formik';
import React from 'react'
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';

function FormCheckboxField(props: FieldHookConfig<string> & {label?: string}) {

    const [field, meta] = useField(props);
    
  return (
    <FormControlLabel control={<Checkbox {...field} name={props.name}/>} label={props.label} />
  )
}

export default FormCheckboxField