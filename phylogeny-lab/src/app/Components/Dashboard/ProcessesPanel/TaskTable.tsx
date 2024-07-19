"use client";

import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, ChipProps, getKeyValue} from "@nextui-org/react";
import {TaskColumns} from "@/utils/TableColumns";
import { taskData } from "@/models/TaskData";
import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus";
import { FaInfoCircle, FaInfo } from "react-icons/fa";
import { MdDeleteForever, MdInfo } from "react-icons/md";
import TaskModal from "./taskModal";
import AbortModal from "./RevokeModal";


export const statusColorMap: Record<string, ChipProps["color"]>  = {
  SUCCESS : "success",
  FAILURE: "danger",
  STARTED: "warning",
  REVOKED: "default"
};

interface Props {
  tasks: Array<taskData>
}


export default function TaskTable({ tasks }: Props) {

    type Tasks = typeof tasks[0];
  const renderCell = React.useCallback((task: Tasks, columnKey: React.Key) => {
    const cellValue = task[columnKey as keyof Tasks];

    switch (columnKey) {
      case "uuid":
        return (
          <div>
            {task.uuid.substring(0, 6)}...{task.uuid.substring(task.uuid.length - 6, task.uuid.length)}
          </div>
        );
      case "name":
        return (
          <div>
            {task.name}
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[task.status]} size="sm" variant="dot" style={{border: 'none'}}>
            {task.status.toLowerCase()}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-end content-center dark">
            <TaskModal rowData={task} />
            <AbortModal task_id={task.uuid} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
  <Table aria-label="Example table with custom cells">
      <TableHeader columns={TaskColumns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={tasks} className="h-16" emptyContent='No running tasks'>
        {(item: taskData) => (
          <TableRow key={item.uuid}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
