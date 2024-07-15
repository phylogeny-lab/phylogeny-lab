import React, { FC, ReactNode, useState } from 'react'
import { TFiles } from "./FileData"
import { FaFile, FaFileZipper, FaFolder, FaFolderOpen } from "react-icons/fa6";
import { GiDna1 } from "react-icons/gi";
import { Checkbox } from '@nextui-org/react';

type EntryProps = {
    tree: TFiles;
    parent?: string;
    depth?: number;
    setSelectedNodes: React.Dispatch<React.SetStateAction<any>>;
}

const iconSize = 12

  
  export default function Treeview({ tree, setSelectedNodes, depth = 0, parent = '/' }: EntryProps ): ReturnType<FC> {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const getFileExtension = ((name: string) => {
      const split = tree.name.split('.')
      return split[split.length - 1]
    })
  
    return (
      <>
        <button className='flex gap-2 font-thin text-md content-center items-center' onClick={(e) => {
          setIsExpanded(prev => !prev)
        }}>
          {tree.children && (
            <>
            <div style={{ paddingLeft: "6px", paddingRight: "6px", width: "20px" }} >
              {isExpanded ? "-" : "+"}
            </div>
            {isExpanded ? <FaFolderOpen size={iconSize} /> : <FaFolder size={iconSize} /> }
            </>
          )}
          <span className="name flex gap-2 items-center content-center" style={{ paddingLeft: tree.children ? "" : "20px" }} >
            {!tree.children &&  <Checkbox size='sm' onValueChange={(val: boolean) => {val && setSelectedNodes((prev: any) => [...prev, parent + tree.name])}} />}
            {!tree.children && (
              getFileExtension(tree.name) === 'zip' ? <FaFileZipper size={iconSize} /> : 
              ['fasta', 'fa', 'fna', 'aln', 'fastq', 'ffn', 'frn', 'mpfa', 'fas'].includes(getFileExtension(tree.name)) ? <GiDna1 size={iconSize} /> : <FaFile size={iconSize} /> 
            )}
            {tree.name}
          </span>
        </button>
        <div style={{ borderLeft: "1px solid #71797E", margin: "5px 5px" }}>
          {isExpanded && (<div style={{ paddingLeft: `5px` }} >
            {tree.children?.map((child) => (
              <Treeview tree={child} depth={depth + 1} parent={parent + tree.name + '/'} setSelectedNodes={setSelectedNodes} />
            ))}
          </div>)}
        </div>
      </>
    )
  }