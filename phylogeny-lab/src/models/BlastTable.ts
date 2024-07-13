import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus";

export type BlastTable = {
    id: string;
    jobTitle: string;
    db: string;
    status: CeleryTaskStatus;
    algorithm: string;
    created_at: string;
}