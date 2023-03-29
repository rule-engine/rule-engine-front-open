import {request, METHOD} from '@/utils/request'
import {variable} from "@/services/api";

/**
 * 保存规则变量
 * @param param
 */
export async function addVariable(param) {
    return request(variable.ADD, METHOD.POST, param)
}

/**
 * 验证变量名字是否存在
 * @param param
 */
export async function verifyVariableName(param) {
    return request(variable.VERIFY_VARIABLE_NAME, METHOD.POST, param)
}

/**
 * 获取变量列表
 * @param query
 */
export async function listVariable(query) {
    return request(variable.LIST, METHOD.POST, query)
}

/**
 * 根据id查询
 * @param query
 */
export async function get(query) {
    return request(variable.GET, METHOD.POST, query)
}

/**
 * 根据id更新
 * @param query
 * @constructor
 */
export async function updateVariable(query) {
    return request(variable.UPDATE, METHOD.POST, query)
}

/**
 * 根据id删除
 * @param query
 * @constructor
 */
export async function deleteById(query) {
    return request(variable.DELETE, METHOD.POST, query)
}

export default {
    updateVariable,
    deleteById,
    get,
    listVariable,
    addVariable,

}
