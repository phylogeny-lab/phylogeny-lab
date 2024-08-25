import { colors, IconButton, Tooltip } from '@mui/material';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { Children } from 'react'
import { FaDownload } from 'react-icons/fa';
import { IoHelpCircleOutline } from 'react-icons/io5';

interface Props {
    children: React.ReactNode;
    help?: string;
    helpLabel?: string;
}

function FormLabel({ children, help, helpLabel = "Info" }: Props) {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div className='flex items-center gap-1'>
            <h3 className='text-gray-400 font-light mb-5 mt-5'>{children}</h3>
            {help ? <Tooltip title={helpLabel} sx={{ width: '2.2rem', height: '2.2rem', color: colors.grey[400] }}>
                <IconButton onClick={onOpen}>
                    <IoHelpCircleOutline />
                </IconButton>
            </Tooltip>
                :
                <></>}


            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-center border-b-1 border-gray-500 border-opacity-80 text-gray-400">{children}</ModalHeader>
                            <ModalBody className='mt-4 overflow-y-scroll max-h-96'>
                                <p className='text-gray-400 font-light whitespace-pre-line'>
                                    {help}
                                </p>
                            </ModalBody>
                            <ModalFooter className='flex justify-between items-center'>
                                <Button color="default" variant='light' onPress={onClose}>
                                    Close
                                </Button>
                                <Button color='secondary' variant='light'>
                                    <FaDownload />
                                    Download manual
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default FormLabel