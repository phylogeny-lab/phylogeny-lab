import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus";

interface taskData {
    uuid: string;
    name: string;
    status: CeleryTaskStatus;
    args: any;
}
  
interface workerData {
  hostname: string;
  pid?: number;
  active: number;
  processed: number;
  loadavg: number[];
  status?: boolean;
}

export { type taskData, type workerData }