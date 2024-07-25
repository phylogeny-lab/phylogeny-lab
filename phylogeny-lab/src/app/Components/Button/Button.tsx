import React from 'react'
import { Button } from '@nextui-org/react'
import { colors } from '@mui/material';

interface Props {
    dark?: boolean;
    children: React.ReactNode;
    disabled?: Boolean;
    color?: string;
    onClick?: any;
}

function NextButton({ dark, disabled, children, onClick, color = colors.grey[200] }: Props) {
  return (
    <Button onClick={onClick} variant='solid' style={{ background: disabled ? 'rgba(255,255,255,0.13)' : 'success', color: disabled ? 'rgba(255,255,255,0.3)' : color}} disabled={disabled == true} className={`${dark && 'dark'}`}>{children}</Button>
  )
}

export default NextButton