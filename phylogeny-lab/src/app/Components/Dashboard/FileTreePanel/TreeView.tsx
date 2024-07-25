import React, { FC, ReactNode, useState } from 'react'
import { TFiles } from "./FileData"
import { FaFile, FaFileZipper, FaFolder, FaFolderOpen } from "react-icons/fa6";
import { GiDna1 } from "react-icons/gi";
import { Checkbox } from '@nextui-org/react';
import { removeItemAll } from '@/utils/utils';

type EntryProps = {
    tree: TFiles;
    parent?: string;
    depth?: number;
    setSelectedNodes: React.Dispatch<React.SetStateAction<any>>;
    setFileSize: React.Dispatch<React.SetStateAction<any>>;
}

const iconSize = 13

  
  export default function Treeview({ tree, setSelectedNodes, setFileSize, depth = 0, parent = '/' }: EntryProps ): ReturnType<FC> {
    const [isExpanded, setIsExpanded] = useState<boolean>(parent === '/' ? true : false);

    const getFileExtension = ((name: string) => {
      const split = tree.name.split('.')
      return split[split.length - 1]
    })

    const addNode = () => {
      setSelectedNodes((prev: any) => new Set([...prev, parent + tree.name])); 
      setFileSize((prev: number) => (prev + tree.size))
    }

    const removeNode = () => {
      setSelectedNodes((prev: any) => new Set(removeItemAll([...prev, parent + tree.name], parent + tree.name)));
      setFileSize((prev: number) => (prev - tree.size))
    }
  
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
            {!tree.children &&  <Checkbox style={{marginRight: 'none'}} size='sm' onValueChange={(val: boolean) => {
              val ? 
              // on select
              addNode()
              :
              // on deselect
              removeNode()
            }} />}
            <span className='flex content-center items-center gap-1'>
            {!tree.children && (
              getFileExtension(tree.name) === 'zip' ? <FaFileZipper size={iconSize} /> : 
              ['fasta', 'fa', 'fna', 'aln', 'fastq', 'ffn', 'frn', 'mpfa', 'fas', 'nex'].includes(getFileExtension(tree.name)) ? <GiDna1 size={iconSize} /> : <FaFile size={iconSize} /> 
            )}
            {tree.name}
            </span>
          </span>
        </button>
        <div style={{ borderLeft: "1px solid #71797E", margin: "5px 5px" }}>
          {isExpanded && (<div style={{ paddingLeft: `5px` }} >
            {tree.children?.map((child, i) => (
              <Treeview key={i} tree={child} depth={depth + 1} parent={parent + tree.name + '/'} setFileSize={setFileSize} setSelectedNodes={setSelectedNodes} />
            ))}
          </div>)}
        </div>
      </>
    )
  }