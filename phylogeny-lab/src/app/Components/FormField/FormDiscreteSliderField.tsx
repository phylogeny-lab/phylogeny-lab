"use client";

import { Slider } from '@mui/material';
import { FieldConfig, FieldHookConfig, useField, useFormikContext } from 'formik';
import React from 'react'

function FormDiscreteSliderField(props: FieldHookConfig<any> & { min: number, max: number, step: number, id: string } ) {

  const [field, meta] = useField(props);


  return (
    <>
    <Slider
        aria-label="Temperature"
        defaultValue={props.value}
        //getAriaValueText={} use for modifying display text
        valueLabelDisplay="auto"
        shiftStep={5}
        step={props.step}
        id={props.id}
        min={props.min}
        max={props.max}
        {...field} 
      />
      </>
  )
}

export default FormDiscreteSliderField