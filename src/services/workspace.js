import {workspace} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 获取工作空间列表
 */
export async function list(query) {
    return request(workspace.LIST, METHOD.POST, query)
}

/**
 * 切换工作空间
 */
export async function change(param) {
    return request(workspace.CHANGE, METHOD.POST, param)
}

/**
 * 获取当前工作空间
 */
export async function currentWorkspace(query) {
    return request(workspace.CURRENT_WORKSPACE, METHOD.POST, query)
}

/**
 * @Description: 根据id获取工作空间信息
  **/
export async function selectWorkSpaceById(query) {
    return request(workspace.SELECT_WORKSPACE_BY_ID, METHOD.POST, query)
}

/**
 * 检查工作空间code
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function verifyWorkspaceCode(query) {
    return request(workspace.VERIFY_WORKSPACE_CODE, METHOD.POST, query)
}

export async function add(query) {
    return request(workspace.ADD, METHOD.POST, query)
}

export async function edit(query) {
    return request(workspace.EDIT, METHOD.POST, query)
}

export async function deleteWorkspace(query) {
    return request(workspace.DELETE_WORKSPACE, METHOD.POST, query)
}

export async function accessKey(query) {
    return request(workspace.ACCESS_KEY, METHOD.POST, query)
}

export async function updateAccessKey(query) {
    return request(workspace.UPDATE_ACCESS_KEY, METHOD.POST, query)
}


export default {
    list,
    change,
    currentWorkspace,
    deleteWorkspace,
    accessKey,
    updateAccessKey,
    selectWorkSpaceById
}
