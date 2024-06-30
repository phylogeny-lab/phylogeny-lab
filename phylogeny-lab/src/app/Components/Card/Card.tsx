"use client";

import React from 'react'

function Card({ children }: any) {
  return (
    <div className='bg-[var(--bg-primary)] p-4 border-1 border-gray-500 border-opacity-20 rounded-lg dark text-wrap'>{children}</div>
  )
}

export default Card