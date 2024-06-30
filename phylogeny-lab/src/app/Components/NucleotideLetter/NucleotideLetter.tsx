"use client"

import React from 'react'

interface Props {
    children?: any;
    highlighted?: boolean;
}

function NucleotideLetter({ children, highlighted }: Props) {
  return (
    <span className={`text-center ${highlighted ? 'bg-blue-300' : 'bg-transparent' } ${children === 'A' ? 'text-blue-600' : children === 'T' ? 'text-green-600' : children === 'C' ? 'text-red-600' : children === 'G' ? 'text-yellow-600' : 'text-white'}`}>{children}</span>
  )
}

export default NucleotideLetter