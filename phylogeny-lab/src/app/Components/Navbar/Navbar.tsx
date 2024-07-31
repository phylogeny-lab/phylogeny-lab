"use client";

import React, { useEffect } from 'react'
import Hr from '../Hr/Hr';
import NavButton from '../NavButton/NavButton';
import { useRouter, usePathname } from 'next/navigation'

function NavBar() {

    const pathname = usePathname()

    useEffect(() => {
        console.log(pathname)
      }, [pathname])
    
  return (
    <nav className="navbar">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-[var(--navbar-height)] items-center">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">

                <button type="button" className="relative inline-flex items-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>

                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>

                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                </div>
                <div className="hidden sm:block">
                    <div className="flex space-x-4">
                        <NavButton href={'/'} active={pathname === '/'}>Dashboard</NavButton>
                        <NavButton href={'/featureselection'} active={pathname.split('/')[1] === 'featureselection'}>Feature Selection</NavButton>
                        <NavButton href={'/blast'} active={pathname.split('/')[1] === 'blast'}>Blast</NavButton>
                        <NavButton href={'/alignment'} active={pathname.split('/')[1] === 'alignment'}>Alignment</NavButton>
                        <NavButton href={'/biomart'} active={pathname.split('/')[1] === 'biomart'}>Biomart</NavButton>
                        <NavButton href={'/mrbayes'} active={pathname.split('/')[1] === 'mrbayes'}>Mr Bayes</NavButton>
                        <NavButton href={'/tree'} active={pathname.split('/')[1] === 'tree'}>Tree</NavButton>
                    </div>
                </div>
            </div>

            </div>
        </div>

        <div className="sm:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2">
            <a href="#" className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" aria-current="page">Dashboard</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Team</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Projects</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Calendar</a>
            </div>
        </div>
        </nav>

  )
}

export default NavBar