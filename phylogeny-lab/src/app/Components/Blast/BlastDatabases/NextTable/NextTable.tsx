"use client";

import React, { useEffect, useState } from "react";
import Search from '@mui/icons-material/Search';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import AddIcon from '@mui/icons-material/Add';
import { Button, CircularProgress, colors } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GenomeAvatar from "../GenomeAvatar/GenomeAvatar";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  NextUIProvider,
} from "@nextui-org/react";
import { statusOptions, genusIconMap, speciesIconMap } from "@/utils/DatabaseMaps";
import { DatabaseColumns as columns } from "@/utils/TableColumns";
import { ThemeProvider } from "@emotion/react";
import { PiDnaLight } from "react-icons/pi";
import axios from "axios";
import { FaCloudArrowDown, FaDatabase, FaDownload, FaVirusCovid } from "react-icons/fa6";
import DatabaseCard from "../DatabaseCard/DatabaseCard";
import { FaInfoCircle } from "react-icons/fa";
import InfoCard from "../InfoCard/InfoCard";
import { bringToFrontByTaxIDS, convertNcbiToDatabaseTable, convertCustomToDatabaseTable, LoadDatabases } from "@/utils/BlastDatabases";
import DropDownButton from "../DropDownButton/DropDownButton";

const INITIAL_VISIBLE_COLUMNS: string[] = ["organism_name", "status", "assembly_name", "tax_id", "release_date", "total_sequence_length", "total_number_of_chromosomes", "source_database", "more_info"];
const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_ENDPOINT

interface Props {
  title: string;
}

async function DownloadDatabases(databases: any) {
  return new Promise<DatabaseDisplayTable[]>(async (resolve, reject) => {

    const data = {
      databases: Array.from(databases)
    }
  
    await axios.post(BASE_URL + '/blastdb/ncbi', data)
    .then((res: any) => {
      
      LoadDatabases()
      .then((dbs: DatabaseDisplayTable[]) => {resolve(dbs)})
      .catch((err: any) => reject(err))
    })
    .catch((err: any) => {
      reject(err)
    })
  })

  
}

export default function NextTable({ title }: Props) {

  const [databases, setDatabases] = useState(Array<DatabaseDisplayTable>)
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set<any>());
  const [selectedDBNames, setSelectedDBNames] = useState(new Set<any>());
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [isDownloading, setIsDownloading] = useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<any>({
    column: "status",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);

  const LoadDatabasesFromServer = () => {

    LoadDatabases()
    .then((dbs: DatabaseDisplayTable[]) => {
      const statuses = dbs.map((item: DatabaseDisplayTable) => (item.status))

      statuses.includes('installing') ? setIsDownloading(true) : setIsDownloading(false);
      
      setDatabases(dbs)
    })
    .catch((err: any) => {console.log(err)})
  }

  useEffect(() => {

    LoadDatabasesFromServer()

    const intervalId = setInterval(LoadDatabasesFromServer, 5000);

    return () => clearInterval(intervalId);

  }, []);


  const pages = Math.ceil(databases.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);


  const headerColumns = React.useMemo(() => {

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...databases];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((database: DatabaseDisplayTable) =>
        database.organism_name.toLowerCase().includes(filterValue.toLowerCase()) ||
        database.common_name?.toLowerCase().includes(filterValue.toLocaleLowerCase()) ||
        database.tax_id?.toString().includes(filterValue.toLocaleLowerCase()) ||
        database.assembly_name?.toString().includes(filterValue.toLocaleLowerCase()) ||
        database.assembly_type?.toString().includes(filterValue.toLowerCase()) ||
        database.submitter?.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()) ||
        database.accession_name?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((database: DatabaseDisplayTable) =>
        Array.from(statusFilter).includes(database.status),
      );
    }

    return filteredUsers;
  }, [databases, filterValue, statusFilter, selectedDBNames, selectedKeys, hasSearchFilter]);


  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof DatabaseDisplayTable] as number
      const second = b[sortDescriptor.column as keyof DatabaseDisplayTable] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);


  const renderCell = React.useCallback((database: DatabaseDisplayTable, columnKey: any) => {

    const genus = database.organism_name?.split(' ')[0].toLowerCase()
    const species = database.organism_name?.toLowerCase()
    const source_database = database.source_database?.toLocaleLowerCase()

    switch (columnKey) {
      case "organism_name":
        return (
          <div className="flex items-center gap-4">
            <GenomeAvatar database={database} genus={genus} species={species} />
            <p className="cursor-text">{database.organism_name}</p>
          </div>
        );
      case "status":
        return (
          <p
            className={`capitalize border-none gap-2 flex items-center  ${database.status === 'installed' ? 'text-green-600' : database.status === 'installing' ? 'text-gray-500' : 'text-blue-500'}`}
          >

            {database.status === 'installing' ? <>Installing<CircularProgress color="inherit" size={17} /></> :
            database.status === 'available' ? <>Available<FaCloudArrowDown /></> :
            database.status === 'installed' && <>Installed<FaDownload /></>
            }

          </p>
        );
      case "source_database":
        return (
          <div className="flex flex-col border-width">
            {source_database && (
              source_database?.toLowerCase().includes("refseq") ? 
                <Chip variant="bordered" classNames={{
                  base: "border-blue-600 border-1",
                  content: "text-blue-600 text-center"
                }}>Refseq</Chip> : 
              source_database?.toLowerCase().includes("genbank") ? 
                <Chip variant="bordered" classNames={{
                  base: "border-purple-600 border-1",
                  content: "text-purple-600 text-center"
                }}>Genbank</Chip> : 
              <Chip classNames={{
                base: "border-indigo-600 border-1",
                content: "text-indigo-600 text-center"
              }} variant="bordered">{source_database?.toLowerCase().split('_').slice(-1).pop()}</Chip>)}
          </div>
        );
      case "tax_id":
        return (
          <div className="flex flex-col justify-center">
            <p className="text-bold text-small capitalize cursor-text">{database.tax_id}</p>
          </div>
        );
      case "total_sequence_length":
        return (
          <div className="flex flex-col justify-center">
            <p className="text-bold text-small capitalize">{database.total_sequence_length}</p>
          </div>
        );
      case "total_number_of_chromosomes":
        return (
          <div className="flex flex-col justify-center">
            <p className="text-bold text-small capitalize">{database.total_number_of_chromosomes? database.total_number_of_chromosomes : '-'}</p>
          </div>
        );
      case "release_date":
        return (
          <div className="flex flex-col justify-center">
            <p className="text-bold text-tiny capitalize text-default-500">{database.release_date?.toDateString()}</p>
          </div>
        )
      case "total_genes":
        return (
          <div className="flex flex-col justify-center">
            <p className="text-bold text-tiny capitalize text-default-500">{database.total_genes}</p>
          </div>
        )
      case "accession_name":
        return (
          <div className="flex flex-col justify-center">
            <p className="text-bold text-tiny capitalize text-default-500 cursor-text">{database.accession_name}</p>
          </div>
        )
      case "assembly_name":
        return (
          <div className="flex flex-col justify-center">
            <p className="text-bold text-tiny capitalize text-default-500 cursor-text">{database.assembly_name}</p>
          </div>
        )
      case "assembly_type":
        return (
          <div className="flex flex-col justify-center">
            <p className="text-bold text-tiny capitalize text-default-500 cursor-text">{database.assembly_type}</p>
          </div>
        )
      case "gc_count":
          return (
            <div className="flex flex-col justify-center">
              <p className="text-bold text-tiny capitalize text-default-500">{database.gc_count}</p>
            </div>
          )
      case "gc_percent":
        return (
          <div className="flex flex-col justify-center">
            <p className="text-bold text-tiny capitalize text-default-500">{database.gc_percent}</p>
          </div>
        )
      case "more_info":
        return (
          <div className="flex justify-end">
            <DatabaseCard dataRow={database} genus={genus} species={species} />
          </div>
        )
    }
  }, [selectedDBNames]);

  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);


  const onSearchChange = React.useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-1">
          <div className="flex gap-3 items-center content-center">
            <div className="flex gap-0 content-center">
            <div className="flex-col justify-center">
              <h1 className="font-bold text-lg h-full content-center">{title}</h1>
            </div>
            <InfoCard icon={<FaInfoCircle />} width="2rem" height="2rem" />
            </div>
            <Input
              isClearable
              classNames={{
                base: "w-96",
                inputWrapper: "border-1",

              }}
              placeholder="e.g. GCF_009806435.1, horse, 9606, zika virus"
              size="sm"
              startContent={<Search className="text-default-300" />}
              value={filterValue}
              variant="bordered"
              onClear={() => setFilterValue("")}
              onValueChange={onSearchChange}
            />
          </div>
          <div className="flex gap-3">
            <Dropdown className="dark">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  color="secondary"
                  startIcon={<KeyboardArrowDownIcon />} //TODO: insert chevron icon
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(item: any) => {setStatusFilter(item)}}
              
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="dark">
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  color="secondary"
                  startIcon={<KeyboardArrowDownIcon />}
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(item: any) => {setVisibleColumns(item)}}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <DropDownButton 
            startIcon={<AddIcon />} 
            >
              Create
            </DropDownButton>
            <Button onClick={() => {
                setIsDownloading(true)
                setSelectedKeys(new Set())
                DownloadDatabases(selectedKeys).then((new_databases: DatabaseDisplayTable[] ) => {
                  setDatabases(new_databases)
                })
                
              }
            }
              startIcon={isDownloading ? <CircularProgress color="inherit" size={17} /> : <CloudDownloadIcon />}
              color={selectedKeys && 'primary'}
              disabled={!selectedKeys.size || isDownloading}
              variant="contained"
              key="download_btn"
            >
              {isDownloading ? 'Installing' : 'Download'}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {databases.length} databases</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    databases.length,
    hasSearchFilter,
    selectedKeys,
    selectedDBNames,
    isDownloading,
    title,
  ]);

  const bottomContent = React.useMemo(() => {

    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "text-background",
          }}
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          color="success"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {`${selectedKeys.size} of ${items.length} selected`}
            
        </span>
        
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = React.useMemo(
    () => ({
      wrapper: ["max-h-[382px]", "max-w-3xl"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      td: [
        // changing the rows border radius
        // first
        "group-data-[first=true]:first:before:rounded-none",
        "group-data-[first=true]:last:before:rounded-none",
        // middle
        "group-data-[middle=true]:before:rounded-none",
        // last
        "group-data-[last=true]:first:before:rounded-none",
        "group-data-[last=true]:last:before:rounded-none",
      ],
    }),
    [selectedDBNames],
  );

  return (
    <div className="bg-[var(--bg-primary)] p-4 border-1 border-gray-500 border-opacity-20 rounded-lg dark">

      

      <Table

        isCompact
        color="primary"
        removeWrapper
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={classNames}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={ (item: any) => {
          setSelectedKeys(item)
          
        }}
        onSortChange={(item: any) => {setSortDescriptor(item)}}

      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              style={{ /*add styles here for columns*/ }}
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No databases found"} items={sortedItems}>
          {(item: DatabaseDisplayTable) => (
            <TableRow key={`${item.accession}|${item.organism_name}`}>
              {(columnKey: any) => <TableCell >{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

    </div>

  );
}
