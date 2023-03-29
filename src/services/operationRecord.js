import {request, METHOD} from '@/utils/request'
import {operationRecord} from "@/services/api";


export async function operationRecordList(param) {
    return request(operationRecord.OPERATION_RECORD, METHOD.POST, param)
}
