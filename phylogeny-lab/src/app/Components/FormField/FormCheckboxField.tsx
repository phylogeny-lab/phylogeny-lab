"use client";

import { FieldConfig, FieldHookConfig, useField, useFormikContext } from 'formik';
import React from 'react'
import Checkbox from '@mui/material/Checkbox';

function FormCheckboxField(props: FieldHookConfig<string> & {label?: string}) {

    const [field, meta] = useField(props);
    
  return (
    <Checkbox {...field} name={props.name} aria-label={props.label} />
  )
}

export default FormCheckboxField