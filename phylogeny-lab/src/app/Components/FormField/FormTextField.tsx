"use client";

import { TextField } from "@mui/material";
import { FieldConfig, FieldHookConfig, useField } from "formik";


const FormTextField = (props: FieldHookConfig<any> & { label: string, multiline?: boolean, rows?: number, onInput?: any, disabled?: boolean, placeholder?: string }) => {
    const [field, meta] = useField(props);

    return (
        <TextField 
            fullWidth 
            label={props.label} 
            multiline={props.multiline}
            rows={props.rows}
            inputProps={{ spellCheck: 'false' }}
            placeholder={props.placeholder}
            {...field} 
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
        />
    )
}

export default FormTextField