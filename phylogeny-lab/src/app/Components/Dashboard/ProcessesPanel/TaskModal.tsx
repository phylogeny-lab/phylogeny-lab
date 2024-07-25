import { taskData } from '@/models/TaskData';
import { Button, Chip, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import { MdInfo } from 'react-icons/md';
import { statusColorMap } from './TaskTable';

interface Props {
    rowData: taskData;
}

function TaskModal({ rowData }: Props) {

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [args, setArgs] = useState<Array<any>>([])

    useEffect(() => {
        const data: string = rowData.args.substring(rowData.args.indexOf('{') + 1, rowData.args.lastIndexOf('}'))
        const properties = data.replaceAll("'", '').replaceAll("\"", '').split(',')
        setArgs(properties)    
    }, [])
    
  return (
    <>
    <Tooltip content="Task info" color='foreground'>
        <span onClick={onOpen} className="text-lg text-default-400 cursor-pointer active:opacity-50 dark">
            <MdInfo />
        </span>
    </Tooltip>
    <Modal className='dark' isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
      {(onClose) => (
        <>
            <ModalHeader className='flex flex-col gap-1'>
            <div className='flex gap-2 items-center'>
            <h1 className='text-center'>{rowData.name}</h1>
            </div>
            <h2 className='light text-gray-400 text-sm'>{rowData.uuid}</h2>
            </ModalHeader>
          
          <ModalBody>
                Parameters:
                <div className='leading-3'>
                {args.map((item: string, i: number) => (
                  <div key={i} className='flex items-center gap-4 text-gray-400 text-xs font-light'>
                  <span>{item.split(':')[0]}</span>
                  <span>{item.split(':')[1]}</span>
                  </div>
                ))}
                </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
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

export default TaskModal