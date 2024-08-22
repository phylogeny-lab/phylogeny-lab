import { colors, IconButton, Tooltip } from '@mui/material';
import React, { Children } from 'react'
import { IoHelpCircleOutline } from 'react-icons/io5';

interface Props {
    children: React.ReactNode;
    help? : string;
}

function FormLabel({ children, help }: Props) {
  return (
    <div className='flex items-center gap-1'>
        <h3 className='text-gray-400 font-light mb-5 mt-5'>{children}</h3>
        {help ? <Tooltip title="Delete" sx={{width: '2.2rem', height: '2.2rem', color: colors.grey[400]}}>
        <IconButton>
            <IoHelpCircleOutline />
        </IconButton>
        </Tooltip> 
        : 
        <></>}
    </div>
  )
}

export default FormLabel