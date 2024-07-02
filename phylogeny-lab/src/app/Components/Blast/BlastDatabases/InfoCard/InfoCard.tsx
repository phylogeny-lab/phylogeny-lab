"use client";

import React from 'react'
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { Avatar, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { FaInfoCircle } from 'react-icons/fa';

interface Props {
    icon: any;
    height?: string;
    width?: string;
}

function InfoCard({ icon, height, width }: Props) {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Tooltip title="Info" sx={{ width: width, height: height }}>
                <IconButton onClick={onOpen}>
                    {icon}
                </IconButton>
            </Tooltip>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='dark'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Databases</ModalHeader>
                            <ModalBody>
                                <p>
                                    Browse available NCBI genome databases for download. 
                                    Due to size constraints, only reference and annotated genomes of Metazoans are shown by default.
                                    (however this can be changed to include a specific group)
                                </p>
                                <p>
                                    {`If the database you're looking for isn${`&apost`} present, you can create one using the assembly reference or tax id.
                                    Alternatively, you can create a database from a custom sequence file.`}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color='inherit' onClick={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default InfoCard