import {condition} from '@/services/api'
import {METHOD, request} from '@/utils/request'

export async function updateCondition(param) {
    return request(condition.UPDATE_CONDITION, METHOD.POST, param)
}

export async function addCondition(param) {
    return request(condition.ADD, METHOD.POST, param)
}