"use client";

import { Slider } from '@mui/material';
import { FieldConfig, FieldHookConfig, useField, useFormikContext } from 'formik';
import React, { EventHandler, useState } from 'react'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function FormFileUpload(props: FieldHookConfig<any> & { label: string, icon: React.ReactElement, disabled?: boolean, setInput?: any }) {

  const { values, touched, setFieldValue } = useFormikContext()
  const [field, meta] = useField(props);
  const [uploaded, setUploaded] = useState(false)
  const [filename, setFilename] = useState("")

  const showFile = async (e: any) => {
    e.preventDefault()
    setFilename(e.target.value.split('\\').slice(-1))
    setFieldValue(props.name, e.target.files[0])
    setUploaded(true)
  }

  const removeFile = (e: any) => {
    e.preventDefault()
    setUploaded(false)
    setFilename("")
    setFieldValue(props.name, "")
    props.setInput && props.setInput(false)
  }

  return (
    <div className='flex flex-col w-fit'>
    <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={props.icon}
        disabled={props.disabled}
        {...field}
    >
        {props.children}
    <VisuallyHiddenInput type="file" accept=".fa,.fasta,.fastq,.fna" onChange={showFile} />
    </Button>
   
    {uploaded && <div className='mt-3 cursor-pointer flex items-center text-sm text-gray-400 font-semibold'> {filename}<button className='ml-2 hover:text-green-500' onClick={removeFile}><CloseIcon />
    </button></div>}
    
    </div>
  )
}

export default FormFileUpload