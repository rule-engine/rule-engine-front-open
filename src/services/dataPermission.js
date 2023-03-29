import {dataPermission} from '@/services/api'
import {request, METHOD} from '@/utils/request'

export async function dataPermissionList(query) {
    return request(dataPermission.LIST, METHOD.POST, query)
}
export async function update(query) {
    return request(dataPermission.UPDATE, METHOD.POST, query)
}

export default {
    dataPermissionList,update
}
