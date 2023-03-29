import {myfunction} from '@/services/api'
import {METHOD, request} from '@/utils/request'


export async function functionList(param) {
    return request(myfunction.LIST, METHOD.POST, param)
}

export async function selectFunctionById(param) {
    return request(myfunction.SELECT_FUNCTION_BY_ID, METHOD.POST, param)
}


export async function runFunction(param) {
    return request(myfunction.RUN, METHOD.POST, param)
}

export default {
    functionList


}
