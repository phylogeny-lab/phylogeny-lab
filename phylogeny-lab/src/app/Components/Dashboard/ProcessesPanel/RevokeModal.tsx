import { ToastFail, ToastSuccess } from '@/utils/Toast';
import { revokeTask } from '@/utils/WorkerApi';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { MdDeleteForever } from 'react-icons/md'

interface Props {
    task_id: string;
}

function AbortModal({task_id}: Props) {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    
  return (
    <>
    <Tooltip color="danger" content="Stop Task">
        <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={onOpen}>
            <MdDeleteForever />
        </span>
    </Tooltip>

    <Modal className='dark' isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
    {(onClose) => (
        <>
            <ModalHeader className='flex flex-col gap-1'>
            
            </ModalHeader>
        
        <ModalBody>
            Revoke this task?
        </ModalBody>
        <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
            Close
            </Button>
            <Button color="danger" variant="light" onPress={() => {
                onclose
                revokeTask(task_id)
                .then((_: any) => ToastSuccess("Revoked task"))
                .catch((_: any) => ToastFail("Could not abort task"))
            }}>
            Revoke
            </Button>
        </ModalFooter>
        </>
    )}
    </ModalContent>
    </Modal>
    </>
  )
}

export default AbortModal