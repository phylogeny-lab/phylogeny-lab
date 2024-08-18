"use client";

import { genusIconMap, speciesIconMap } from '@/utils/DatabaseMaps';
import { Avatar } from '@mui/material';
import React from 'react'
import { FaDatabase, FaVirusCovid } from 'react-icons/fa6';

interface Props {
    database: DatabaseDisplayTable;
    genus: string;
    species: string;
    height?: string;
    width?: string;
    small?: boolean;
}

function GenomeAvatar({ database, genus, species, height, width, small }: Props ) {
    return (
        <Avatar sx={{ display: 'flex', justifyContent: 'center', background: "transparent", border: '1px solid #808080', color: '#808080', padding: species === 'homo sapiens' ? '1px' : '4px', height: height, width: width }}>
            {
                speciesIconMap[species] ? <img src={speciesIconMap[species]} /> :
                    genusIconMap[genus] ? <img src={genusIconMap[genus]} /> :
                        database.assembly_name?.toLowerCase().includes('viral') || database.organism_name?.toLowerCase().includes('virus') ? <FaVirusCovid size={small ? 25 : 60} /> :
                            <FaDatabase size={small ? 25 : 60} />
            }
        </Avatar>
    )
}

export default GenomeAvatar