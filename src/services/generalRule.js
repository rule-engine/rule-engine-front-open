import {generalRule} from '@/services/api'
import {request, METHOD} from '@/utils/request'

/**
 * 验证规则code
 * @param query
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function verifyRuleCode(query) {
    return request(generalRule.VERIFY_RULE_CODE, METHOD.POST, query)
}

export async function list(query) {
    return request(generalRule.LIST, METHOD.POST, query)
}

export async function deleteGeneralRule(query) {
    return request(generalRule.DELETE, METHOD.POST, query)
}

//保存规则定义
export async function addGeneralRule(param) {
    return request(generalRule.ADD, METHOD.POST, param)
}

//更新规则定义
export async function updateGeneralRuleDefinition(param) {
    return request(generalRule.UPDATE_DEFINITION, METHOD.POST, param)
}


export async function getRuleConfig(query) {
    return request(generalRule.GET_RULE_CONFIG, METHOD.POST, query)
}


export async function getRuleDefinition(query) {
    return request(generalRule.GET_RULE_DEFINITION, METHOD.POST, query)
}


export async function generationRelease(query) {
    return request(generalRule.GENERATION_RELEASE, METHOD.POST, query)
}

export async function runTest(query) {
    return request(generalRule.RUN_TEST, METHOD.POST, query)
}


export async function viewGeneralRule(query) {
    return request(generalRule.VIEW, METHOD.POST, query)
}

export async function saveDefaultAction(query) {
    return request(generalRule.SAVE_DEFAULT_ACTION, METHOD.POST, query)
}

export async function defaultActionSwitch(query) {
    return request(generalRule.DEFAULT_ACTION_SWITCH, METHOD.POST, query)
}

export async function generalRulePublish(query) {
    return request(generalRule.PUBLISH, METHOD.POST, query)
}

export async function generalRuleDownloadList(query) {
    return request(generalRule.DOWNLOAD_LIST, METHOD.POST, query)
}

export async function showHistoryVersionList(query) {
    return request(generalRule.SHOW_HISTORY_VERSION_LIST, METHOD.POST, query)
}

export async function deleteHistoricalRules(query) {
    return request(generalRule.DELETE_HISTORICAL_RULES, METHOD.POST, query)
}

export async function goBack(query) {
    return request(generalRule.GO_BACK, METHOD.POST, query)
}


export async function referenceableList(query) {
    return request(generalRule.REFERENCEABLE_LIST, METHOD.POST, query)
}

export default {
    list,
}
