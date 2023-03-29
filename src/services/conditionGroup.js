import {conditionGroup} from '@/services/api'
import {METHOD, request} from '@/utils/request'

export async function saveOrUpdate(param) {
    return request(conditionGroup.SAVE_OR_UPDATE, METHOD.POST, param)
}

export async function deleteConditionGroup(param) {
    return request(conditionGroup.DELETE_CONDITION_GROUP, METHOD.POST, param)
}


export async function conditionGroupRearrange(param) {
    return request(conditionGroup.REARRANGE, METHOD.POST, param)
}

export default {
    saveOrUpdate

}
