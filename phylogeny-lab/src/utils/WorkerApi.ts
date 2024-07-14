import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus"
import axios, { AxiosError } from "axios"
import { WORKER_API } from "@/app/consts/consts"

const getTaskInfo = async (task_id: string) => {
    return new Promise<any>(async (resolve, reject) => {
        await axios.get(WORKER_API + "/task/info/" + task_id, {
            params: {
                refresh: true
            }
        }).then((res: any) => {
            return resolve(res.data)
        }).catch((err: any) => {
            reject(err)
        })
    })
    
}

const getTaskResult = (task_id: string) => {
    return new Promise<CeleryTaskStatus>(async (resolve, reject) => {

        await axios.get(WORKER_API + "/task/result/" + task_id, {
            params: {
                refresh: true
            }
        }).then((res: any) => {
            const status: string = res.data.state
            const celeryStatus = status?.toLowerCase() === "success" ? CeleryTaskStatus.SUCCESS : status === "failed" ? CeleryTaskStatus.FAILED : CeleryTaskStatus.STARTED
            resolve(celeryStatus)
        }).catch((err: AxiosError) => {
            reject(err)
        })
    })
}

const getTasks = async () => {
    return new Promise<any>(async (resolve, reject) => {
        await axios.get(WORKER_API + "/tasks", {
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

const getWorkers = async () => {
    return new Promise<any>(async (resolve, reject) => {
        await axios.get(WORKER_API + "/workers", {
            params: {
                refresh: true
            }
        }).then((res: any) => {
            resolve(res.data)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

export { getTaskInfo, getTasks, getTaskResult, getWorkers }