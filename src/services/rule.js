import {METHOD, request} from "@/utils/request";
import {rule} from "@/services/api";


export async function saveRuleAndBindRuleSet(query) {
    return request(rule.SAVE_RULE_AND_BIND_RULE_SET, METHOD.POST, query)
}

export async function ruleSetRuleRearrange(param) {
    return request(rule.REARRANGE, METHOD.POST, param)
}

export async function deleteRuleSetRule(param) {
    return request(rule.DELETE_RULE_SET_RULE, METHOD.POST, param)
}

export async function saveAction(query) {
    return request(rule.SAVE_ACTION, METHOD.POST, query)
}

export async function saveOrUpdateRule(query) {
    return request(rule.SAVE_OR_ACTION, METHOD.POST, query)
}
