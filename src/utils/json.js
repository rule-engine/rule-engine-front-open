
/**
 * 设置默认值
 *
 * @param obj
 * @param defaultValue 不传默认值undefined
 * @returns {*[]|*}
 */
export function setDefaultValue(obj, defaultValue) {
    const newObj = obj ? obj.constructor === Array ? [] : {} : defaultValue;
    // constructor 属性返回对创建此对象的数组函数的引用。创建相同类型的空数据
    if (typeof obj !== 'object') {
        return;
    } else {
        for (const i in obj) {
            if (typeof obj[i] === 'object') {//判断对象的这条属性是否为对象
                newObj[i] = setDefaultValue(obj[i]);//若是对象进行嵌套调用
            } else {
                newObj[i] = defaultValue;
            }
        }
    }
    return newObj;
}
