import {request, METHOD} from '@/utils/request'
import {workplace} from "@/services/api";


export async function projectInProgress(param) {
    return request(workplace.PROJECT_IN_PROGRESS, METHOD.POST, param)
}


export async function headInfo(param) {
    return request(workplace.HEAD_INFO, METHOD.POST, param)
}


export async function numberOfCreationsRanking(param) {
    return request(workplace.NUMBER_OF_CREATIONS_RANKING, METHOD.POST, param)
}
