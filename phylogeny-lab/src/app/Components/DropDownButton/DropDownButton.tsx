import { Button } from '@mui/material';
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React from 'react'
import NcbiDatabaseModalContent from '../DatabasePopupTrigger/NcbiDatabaseModalContent';
import CustomDatabaseModalContent from '../DatabasePopupTrigger/CustomDatabaseModalContent';

interface Props {
    children: React.ReactNode;
    startIcon?: React.ReactNode;
}

function DropDownButton({ children, startIcon }: Props) {
    const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
    const ncbiModal = useDisclosure()
    const customModal = useDisclosure()

    return (
      <>
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content: "py-1 px-1 dark",
        }}
      >
        <DropdownTrigger>
          <Button 
            variant="outlined"
            color='info'
            startIcon={startIcon} 
          >
            {children}
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Dropdown menu with description" className='dark'>
        <DropdownSection title="Create options">  

            <DropdownItem
            key={"NCBICreate"}
            shortcut={'⌘C'}
            description={'Creates database from FASTA'}
            onClick={ncbiModal.onOpen}
            
            >
            NCBI Database
            </DropdownItem>

            <DropdownItem
              key={"CustomCreate"}
              shortcut={'⌘N'}
              description={'Creates database from accession or taxid'}
              onClick={customModal.onOpen}
            >
            Custom Database
            </DropdownItem>
            
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

    <Modal isOpen={ncbiModal.isOpen} onOpenChange={ncbiModal.onOpenChange} className='dark'>
    <NcbiDatabaseModalContent closeModal={ncbiModal.onClose} />
    </Modal>

    <Modal isOpen={customModal.isOpen} onOpenChange={customModal.onOpenChange} className='dark'>
    <CustomDatabaseModalContent closeModal={customModal.onClose} />
    </Modal>

    </>
    );

    
}

export default DropDownButton