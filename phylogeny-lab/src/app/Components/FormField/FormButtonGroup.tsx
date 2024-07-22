"use client"

import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { FieldHookConfig, useField, useFormikContext } from 'formik';

export default function FormButtonGroup(props: FieldHookConfig<string> & {options: string[], label?: string}) {
  const { values, touched, setFieldValue } = useFormikContext()
  const [field, meta] = useField(props);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setFieldValue(props.name, newAlignment);
  };

  return (
    <ToggleButtonGroup
      color="info"
      exclusive
      aria-label={props.label}
      {...field} 
    >
        {props.options.map((option: string) => (
            <ToggleButton onChange={handleChange} key={option} value={option}>{option}</ToggleButton>
        ))}
    </ToggleButtonGroup>
  );
}