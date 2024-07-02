"use client";

import React, { useState } from "react";
import BuildIcon from '@mui/icons-material/Build';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { Input, TextField } from "@mui/material";
import { Button as MuiButton } from "@mui/material";
import { Formik } from "formik";
import * as yup from 'yup';
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  params: BlastParams;
}

export default function QueryParamsModal({id, params}: Props) {

  const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_ENDPOINT

  const router = useRouter()

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [changedParam, setChangedParam] = useState(false)

  const validationSchema = yup.object({
    evalue: yup.number().min(0.0001, 'Choose a number >0.0001').required('required'),
    word_size: yup.number().integer().min(1, 'Choose a number >1').required('required'),
    penalty: yup.number().integer().required('required'),
    reward: yup.number().integer().required('required'),
    gapopen: yup.number().integer().required('required'),
    gapextend: yup.number().integer().required('required')
  });

  return (
    <>
      <Button endContent={<BuildIcon fontSize="small" />} size="md" onPress={onOpen}>Blast params</Button>
      <Modal className="dark" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Blast Parameters</ModalHeader>
              

              <Formik

                initialValues={{ evalue: params.evalue, word_size: params.wordSize, gapopen: params.gapOpen, gapextend: params.gapExtend, reward: params.reward, penalty: params.penalty }}
                validationSchema={validationSchema}
                onSubmit={(values) => {

                  axios.post(BASE_URL + `/blast/rerun/${id}`)
                  .then(() => {router.push('/blast')})
                  .catch((err: any) => {console.log(err)})

                }}
                
                >

                  {({

                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  }) => (

                <form onSubmit={handleSubmit}>

                <ModalBody>
                
                <TextField label="Word size" name="word_size" color={errors.word_size ? 'error': 'primary'} value={values.word_size} onInput={(e: React.ChangeEvent<HTMLInputElement>) => {setChangedParam(e.target.value != params.wordSize.toString())}} onChange={handleChange} />
                <TextField label="Expected value" name="evalue" value={values.evalue} onInput={(e: React.ChangeEvent<HTMLInputElement>) => {setChangedParam(e.target.value != params.evalue.toString())}} onChange={handleChange} />

                <div className="flex gap-3">
                  <TextField label="Gap open" name="gapopen" value={values.gapopen} onInput={(e: React.ChangeEvent<HTMLInputElement>) => {setChangedParam(e.target.value != params.gapOpen.toString())}} onChange={handleChange} />
                  <TextField label="Gap extend" name="gapextend" value={values.gapextend} onInput={(e: React.ChangeEvent<HTMLInputElement>) => {setChangedParam(e.target.value != params.gapExtend.toString())}} onChange={handleChange} />
                </div>

                <div className="flex gap-3">
                  <TextField label="Reward" name="reward" value={values.reward} onInput={(e: React.ChangeEvent<HTMLInputElement>) => {setChangedParam(e.target.value != params.reward.toString())}} onChange={handleChange} />
                  <TextField label="Penalty" name="penalty" value={values.penalty} onInput={(e: React.ChangeEvent<HTMLInputElement>) => {setChangedParam(e.target.value != params.penalty.toString())}} onChange={handleChange} />
                </div>
              </ModalBody>


              <ModalFooter>
                <MuiButton className="text-white" type="submit" color="primary"  variant="contained" disabled={!changedParam}>
                  Rerun Query
                </MuiButton>
              </ModalFooter>

              
              </form>
                  )}

              </Formik>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
