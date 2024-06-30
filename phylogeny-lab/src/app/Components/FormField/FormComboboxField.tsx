"use client";

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Field, FieldConfig, FieldHookConfig, useField, useFormikContext } from 'formik';

export default function ComboBox(props: FieldHookConfig<string>) {

    const { values, touched, setFieldValue } = useFormikContext()
    const [field, meta] = useField(props);
    
  return (
    <Autocomplete
        id={props.id}
      options={props.value}
      fullWidth={true}
      {...field}
      defaultValue={props.value[0]}
      onChange={(e, value) => {setFieldValue('organism', value)}}
      renderInput={(params) => <TextField {...params} label={props.name} />}
    />
  );
}

