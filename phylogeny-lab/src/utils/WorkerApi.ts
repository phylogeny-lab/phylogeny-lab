import { CeleryTaskStatus } from "@/enums/CeleryTaskStatus"
import axios, { AxiosError } from "axios"
import { WORKER_API } from "@/app/consts/consts"

const getTaskInfo = async (task_id: string) => {
    await axios.get(WORKER_API + "task/info/" + task_id, {
        params: {
            refresh: 'true'
        }
    }).then((res: any) => {
        return JSON.parse(res?.data)
    }).catch((err: any) => {
        console.error(err)
    })
}

const getTaskResult = (task_id: string) => {
    return new Promise<CeleryTaskStatus>(async (resolve, reject) => {

    await axios.get(WORKER_API + "task/result/" + task_id, {
        params: {
            refresh: 'true'
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
    await axios.get(WORKER_API + "tasks", {
        params: {
            refresh: 'true'
        }
    }).then((res: any) => {
        return res?.data
    }).catch((err: any) => {
        console.error(err)
    })
}

export { getTaskInfo, getTasks, getTaskResult }