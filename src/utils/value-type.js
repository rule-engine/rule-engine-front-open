function getValueTypeName(valueType) {
    switch (valueType) {
        case 'STRING':
            return '字符串'
        case 'NUMBER':
            return '数值'
        case 'COLLECTION':
            return '集合'
        case 'BOOLEAN':
            return '布尔'
        case 'DATE':
            return '日期'
        case 'FUNCTION':
            return '函数'
        case 'UNKNOWN':
            return '未知' //返回值不确定
        default:
            return valueType;
    }
}

function getTypeName(v) {
    switch (v.type) {
        case 0:
            return "参数";
        case 1:
            if (v.variableType === 2) {
                return "固定值变量";
            } else if (v.variableType === 3) {
                return "函数变量";
            }
            return "表达式变量";
        case 2:
            return "固定值";
        case 3:
            return "函数";
        case 4:
            return "表达式";
        case 10:
            return "普通规则";
        default:
            return v.type;
    }
}


function valueType(v) {
    if (v.type === 0) {
        return 'PARAMETER';
    }
    if (v.type === 1) {
        return 'VARIABLE';
    }
    if (v.type === 10) {
        return 'GENERAL_RULE';
    }
    if (v.valueType) {
        return v.valueType;
    }
    return undefined;
}


export {getValueTypeName, getTypeName, valueType}
