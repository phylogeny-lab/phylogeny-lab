import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor
} from "@nextui-org/react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Search from '@mui/icons-material/Search';
import { columns } from "./data";
import QueryParamsModal from "../QueryParamsModal/QueryParamsModal";

const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["id", "perc_id", "evalue", "score", "preview", "gaps", "alignLength"];

interface Props {
    id: number;
    title: string;
    hsps: HspTable[];
    params: BlastParams;
}

export default function BlastResultsTable({ id, title, hsps, params }: Props) {
    const [filterValue, setFilterValue] = React.useState("");
    const [previewLength, setPreviewLength] = useState(18)
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const pages = Math.ceil(hsps.length / rowsPerPage);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...hsps];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((hsp) =>
                hsp.qseq.toLowerCase().includes(filterValue.toLowerCase()) || 
                hsp.hseq.toLowerCase().includes(filterValue.toLowerCase()),
            ); 
        }

        return filteredUsers;
    }, [hsps, filterValue, hasSearchFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: HspTable, b: HspTable) => {
            const first = a[sortDescriptor.column as keyof HspTable] as number;
            const second = b[sortDescriptor.column as keyof HspTable] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((hsp: HspTable, columnKey: React.Key) => {
        const cellValue = hsp[columnKey as keyof HspTable];

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-500">{hsp.id}</p>
                    </div>
                );
            case "perc_id":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-500">{((hsp.identity / hsp.alignLength) * 100 ).toFixed(2)}%</p>
                    </div>
            );
            case "preview":
                return (
                        <div className="flex text-bold text-tiny capitalize text-default-500">
                            <div className="flex">
                                <div className="flex flex-col justify-between">
                                    <p className="text-blue-600 mr-2">Q</p>
                                    <p className="text-green-600 mr-2">H</p>
                                </div>
                                {Array(previewLength).fill(0).map((_, i) => { return (
                                    <div key={i} className="flex flex-col justify-between">
                                        <span className="text-center">{hsp.qseq.charAt(i)}</span>
                                        <span className="text-center">{hsp.midline.charAt(i)}</span>
                                        <span className="text-center">{hsp.hseq.charAt(i)}</span>
                                    </div>
                                )})
                            }
                            </div>
                            <div className="flex flex-col justify-between">
                                <p>...</p>
                                <p>...</p>
                            </div>
                            <div className="flex">{
                                Array(previewLength).fill(0).map((_, i) => { return (
                                    <div key={i} className="flex flex-col justify-between">
                                        <span className="text-center">{hsp.qseq.charAt(hsp.qseq.length - previewLength + i)}</span>
                                        <span className="text-center">{hsp.midline.charAt(hsp.midline.length - previewLength + i)}</span>
                                        <span className="text-center">{hsp.hseq.charAt(hsp.hseq.length - previewLength + i)}</span>
                                    </div>
                                )})
                            }
                            </div>
                        </div>
                );
            default:
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-tiny capitalize text-default-500">{cellValue}</p>
                    </div>
                )
        }
    }, [previewLength]);


    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
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
                <div className="flex justify-between gap-3 items-end">
                    <div className="flex gap-4 items-center">
                        <h1 className="font-bold text-lg">{title}</h1>
                        <Input
                            isClearable
                            classNames={{
                                inputWrapper: "border-1",
                            }}
                            placeholder="Search by sequence..."
                            size="md"
                            width={72}
                            startContent={<Search />}
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
                                    endContent={<KeyboardArrowDownIcon />}
                                    size="md"
                                    variant="flat"
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
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {column.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <QueryParamsModal params={params} id={id} />

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {hsps.length} Hsps</span>
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
        hsps.length,
        hasSearchFilter,
        id, 
        params,
        title
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "text-background",
                    }}
                    color="primary"
                    isDisabled={hasSearchFilter}
                    page={page}
                    total={pages}
                    variant="light"
                    onChange={setPage}
                />
                <span className="text-small text-default-400">
                    {selectedKeys === "all"
                        ? "All items selected"
                        : `${selectedKeys.size} of ${items.length} selected`}
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
        [],
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
                        wrapper: "after:bg-foreground after:text-background text-background dark",
                    },
                }}
                classNames={classNames}
                selectedKeys={selectedKeys}
                selectionMode="single"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No users found"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
