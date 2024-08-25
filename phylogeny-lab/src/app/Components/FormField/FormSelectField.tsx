"use client";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import React, { useState } from 'react'
import { FieldConfig, FieldHookConfig, useField } from "formik";
import { InputLabel, MenuItem, Select } from '@mui/material';


function FormDropdownField(props: FieldHookConfig<any> & { label?: string, variant?: any, size?: any, options: any, color?: any }) {
    const [field, meta] = useField(props);

    return (
        <>
        <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label={props.label}
            color={props.color}
            {...field} 
            defaultValue={props.options[0]}
            variant={props.variant}
            size={props.size}
        >
          {props.options.map((option: string, i: number) => {
            return(
            <MenuItem color={props.color} key={i} value={option}>{option}</MenuItem>
            )
          })}

        </Select>
        </>
  )
}

export default FormDropdownField