"use client";

import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";

function FileUpload() {

    const fileTypes = ["fa", "fasta", "fastq"]

    const [file, setFile] = useState({'name': ''})

    const handleChange = (file: any) => {
        setFile(file);
    };

  return (
    <>
    <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
    <p>{file ? `File name: ${file.name}` : `No files uploaded yet`}</p>
    </>
  )
}

export default FileUpload