import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus";

interface taskData {
    uuid: string;
    name: string;
    status: CeleryTaskStatus;
}
  
interface workerData {
  hostname: string;
  pid?: number;
  active: number;
  processed: number;
  loadavg: number[];
}

export { type taskData, type workerData }