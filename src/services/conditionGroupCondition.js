import {conditionGroupCondition} from '@/services/api'
import {METHOD, request} from '@/utils/request'


export async function saveConditionAndBindGroup(param) {
    return request(conditionGroupCondition.SAVE_CONDITION_AND_BIND_GROUP, METHOD.POST, param)
}

/**
 * 删除条件
 * @param param
 */
export async function deleteCondition(param) {
    return request(conditionGroupCondition.DELETE_CONDITION, METHOD.POST, param)
}
/**
 * 交换顺序
 * @param param
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function switchOrder(param) {
    return request(conditionGroupCondition.SWITCH_ORDER, METHOD.POST, param)
}

export async function rearrange(param) {
    return request(conditionGroupCondition.REARRANGE, METHOD.POST, param)
}