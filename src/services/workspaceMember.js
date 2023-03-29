import {workspaceMember} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 获取工作空间成员列表
 */
export async function memberList(query) {
    return request(workspaceMember.LIST, METHOD.POST, query)
}

export async function bindMember(query) {
    return request(workspaceMember.BIND_MEMBER, METHOD.POST, query)
}

export async function optionalPersonnel(query) {
    return request(workspaceMember.OPTIONAL_PERSONNEL, METHOD.POST, query)
}

export async function deleteMember(query) {
    return request(workspaceMember.DELETE_MEMBER, METHOD.POST, query)
}


export async function permissionTransferApi(query) {
    return request(workspaceMember.PERMISSION_TRANSFER, METHOD.POST, query)
}

export default {
    memberList
}
