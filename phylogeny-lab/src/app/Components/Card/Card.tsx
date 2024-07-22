"use client";

import React from 'react'

interface Props {
  children?: React.ReactNode;
  style?: React.ComponentProps<'div'>['className'];
}

function Card({ style, children }: Props) {
  return (
    <div className={`bg-[var(--bg-primary)] p-4 border-1 border-gray-500 border-opacity-20 rounded-lg dark text-wrap ${style}`}>{children}</div>
  )
}

export default Card