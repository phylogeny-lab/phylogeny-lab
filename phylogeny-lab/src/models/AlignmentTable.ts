import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus";

export type AlignmentTable = {
    id: string;
    jobTitle: string;
    status: CeleryTaskStatus;
    algorithm: string;
    created_at: string;
}