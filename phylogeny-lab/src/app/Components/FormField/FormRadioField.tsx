"use client";

import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { FieldConfig, FieldHookConfig, useField, useFormikContext } from 'formik';
import React from 'react'

function FormRadioField(props: FieldHookConfig<any> & { label: string, row: boolean, options: string[] }) {

    const { values, touched, setFieldValue } = useFormikContext()
    const [field, meta] = useField(props);
    
  return (
    <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        row={props.row}
        {...field} 
      >
        
        {props.options.map((option: any, i) => {
          return <FormControlLabel key={i} value={option} control={<Radio />} label={option} />
        })}
      </RadioGroup>
  )
}

export default FormRadioField