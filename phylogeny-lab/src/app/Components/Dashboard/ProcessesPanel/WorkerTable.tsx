import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps, getKeyValue } from "@nextui-org/react";
import { WorkerColumns } from "@/utils/TableColumns"
import { taskData, workerData } from "@/models/TaskData";
import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus";
import { FaInfoCircle, FaInfo } from "react-icons/fa";
import { MdDeleteForever, MdInfo } from "react-icons/md";

const statusColorMap: Record<string, ChipProps["color"]> = {
    SUCCESS: "success",
    FAILURE: "danger",
    STARTED: "warning",
};

interface Props {
    workers: Array<workerData>
}


export default function WorkerTable({ workers }: Props) {

    type Workers = typeof workers[0];
    const renderCell = React.useCallback((worker: Workers, columnKey: React.Key) => {
        const cellValue = worker[columnKey as keyof Workers];

        switch (columnKey) {
            case "hostname":
                return (
                    <div>
                        {worker.hostname}
                    </div>
                );
            case "pid":
                return (
                    <div>
                        {worker.pid}
                    </div>
                );
            case "processed":
                return (
                    <div>
                        {worker.processed}
                    </div>
                );
            case "active":
                return (
                    <div>
                        {worker.active}
                    </div>
                )
            case "loadavg":
                return (
                    <div>
                        {JSON.stringify(worker.loadavg)}
                    </div>
                )
            case "actions":
                return (
                    <div className="relative flex items-center gap-2 justify-end content-center dark">
                        <Tooltip content="Task Info" color="foreground">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50 dark">
                                <MdInfo />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <Table aria-label="Example table with custom cells" className="overflow-x-hidden">
            <TableHeader columns={WorkerColumns} className="overflow-x-hidden">
                {(column) => (
                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={workers} className="overflow-x-hidden">
                {(item: workerData) => (
                    <TableRow key={item.hostname}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
