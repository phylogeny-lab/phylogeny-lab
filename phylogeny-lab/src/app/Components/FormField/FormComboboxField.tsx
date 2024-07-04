"use client";

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Field, FieldConfig, FieldHookConfig, useField, useFormikContext } from 'formik';

export default function ComboBox(props: FieldHookConfig<any> & { options: string[], fullWidth: boolean }) {

    const { values, touched, setFieldValue } = useFormikContext()
    const [field, meta] = useField(props);
    
  return (
    <Autocomplete
        id={props.id}
      options={props.options}
      fullWidth={props.fullWidth}
      {...field}
      onChange={(e, value) => {setFieldValue(props.name, value)}}
      renderInput={(params) => <TextField {...params}  />}
    />
  );
}

