import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus"
import axios, { AxiosError, AxiosResponse } from "axios"
import { WORKER_API } from "@/app/consts/consts"
import { taskData } from "@/models/TaskData"

const getTaskInfo = async (task_id: string) => {
    return new Promise<any>(async (resolve, reject) => {
        await axios.get(WORKER_API + "/api/task/info/" + task_id, {
            params: {
                refresh: true
            }
        }).then((res: AxiosResponse) => {
            return resolve(res?.data)
        }).catch((err: any) => {
            reject(err)
        })
    })
    
}

const getTaskResult = (task_id: string) => {
    return new Promise<CeleryTaskStatus>(async (resolve, reject) => {

        await axios.get(WORKER_API + "/api/task/result/" + task_id, {
            params: {
                refresh: true
            }
        }).then((res: AxiosResponse) => {
            const status: string = res?.data?.state
            const celeryStatus = status?.toLowerCase() === "success" ? CeleryTaskStatus.SUCCESS : status === "failed" ? CeleryTaskStatus.FAILED : CeleryTaskStatus.STARTED
            resolve(celeryStatus)
        }).catch((err: AxiosError) => {
            reject(err)
        })
    })
}

const getTasks = async () => {
    return new Promise<any>(async (resolve, reject) => {
        await axios.get(WORKER_API + "/api/tasks", {
            params: {
                refresh: true
            }
        }).then((res: any) => {
            resolve(res?.data)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

const revokeTask = async (id: string) => {
    return new Promise<any>(async (resolve, reject) => {
        await axios.post(WORKER_API + "/api/task/revoke/" + id)
        .then((res: any) => resolve(res))
        .catch((err: any) => reject(err))
    })
}

const getWorkers = async () => {
    return new Promise<any>(async (resolve, reject) => {
        await axios.get(WORKER_API + "/workers", {
            params: {
                json: true
            }
        }).then((res: AxiosResponse) => {
            resolve(res?.data?.data)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

const convertToTaskTable = (data: object) => {

    let rows: Array<taskData> = []
    for (const [_, v] of Object.entries(data)) {
      rows.push({
        'uuid': v['uuid'], 
        'name': v['name'], 
        'status': v['state'],  
        'args': v['args'],
    })
    }
    return rows
}


export { getTaskInfo, getTasks, getTaskResult, getWorkers, convertToTaskTable, revokeTask }