"use client";

import { Slider } from '@nextui-org/react';
import React from 'react'
import { VscGraphScatter } from "react-icons/vsc";

interface WrapperProps {
    children?: React.ReactNode;
}

interface SliderProps {
    markerSize: number;
    setMarkerSize: React.Dispatch<number>;
}

const colors = ['rgba(74,222,128,.7)', 'rgba(59,130,246,.7)', 'rgba(235,64,52,.7)', 'rgba(74,196,212,.7)', 'rgba(232,35,189,.7)', 'rgba(219,125,48,.7)', 'rgba(209,171,36,.7)', 'rgba(146,36,209,.7)']

function PlotWrapper({ children }: WrapperProps) {
    return (
        <div className='absolute left-1/2 -translate-x-1/2 mt-16 flex-col gap-8 justify-center'>{children}</div>
    )
}

function NoDataset() {
    return (
    <div className='text-center justify-center content-center align-middle'>
        <div className='text-gray-400 font-thin text-md h-full text-center content-center mt-72 mb-4'>No Dataset selected. Select one or create new job.</div>
        <div className='w-full flex justify-center'>
            <VscGraphScatter size={50} color='#808080' />
        </div>
    </div>
    )
}

function PlotSlider({ markerSize, setMarkerSize }: SliderProps) {
    return (
        <div className='w-full flex justify-center'>
            <Slider
                label="Marker size"
                step={0.25}
                maxValue={6}
                minValue={0.5}
                defaultValue={4}
                size='sm'
                className="max-w-md"
                value={markerSize}
                onChange={(value: any) => setMarkerSize(value)}
            />
        </div>
    )
}

export { colors, NoDataset, PlotWrapper, PlotSlider }