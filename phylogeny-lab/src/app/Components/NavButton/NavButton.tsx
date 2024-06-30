"use client";

import React from 'react'
import Link from 'next/link'

interface Props {
    href: string;
    active: boolean;
    children: React.ReactNode;
}

function NavButton({href, active, children}: Props) {
  return (
    <Link href={href} className={`${active ? 'bg-green-600' : 'bg-transparent'} text-white rounded-md px-3 py-2 text-sm font-medium aria-current="page"`}>
        {children}
    </Link>
  )
}

export default NavButton