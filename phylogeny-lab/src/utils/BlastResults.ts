import axios from "axios";
import { BASE_URL } from "@/app/consts/consts";

const FetchBlastParamsFromId: Promise<BlastParams> = new Promise((resolve, reject) => {

        const id = 135611189032272
      axios.get(BASE_URL + `/blast/${id}`)
      .then((res: any) => {
        const data = res.data
        const BlastParams = {
          gapExtend: data.gapextend, 
          gapOpen: data.gapopen, 
          wordSize: data.word_size, 
          evalue: data.evalue, 
          reward: data.reward, 
          penalty: data.penalty
        } as BlastParams

        resolve(BlastParams)
      })
      .catch((err: any) => {
        console.error(err)
        reject(err)
    })
})

const FetchBlastHspcsFromId: Promise<BlastParams> = new Promise((resolve, reject) => {

    const id = 135611189032272
    axios.get(BASE_URL + `/blast/results/${id}`)
      .then((res: any) => {
        const result = res.data
        const Hsps = result
          .BlastOutput
          .BlastOutput_iterations
          .Iteration
          .Iteration_hits
          .Hit
          .Hit_hsps
          .Hsp
        
        return Hsps
      })
      .catch((err: any) => {
        console.error(err)
        return {}
    })
})

export { FetchBlastParamsFromId, FetchBlastHspcsFromId };