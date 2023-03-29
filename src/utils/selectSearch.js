import {listInputParameter} from '@/services/inputParameter'
import {listVariable} from '@/services/variable'
import {functionList} from '@/services/function'
import {referenceableList} from '@/services/generalRule'

let timeout;
let currentValue;

export function selectSearch(param, callback, type) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = param.value;

    function fake() {
        let requestData = {
            page: {
                pageSize: 10,
                pageIndex: 1
            },
            query: param,
            orders: []
        };
        if (type === 0) {
            listInputParameter(requestData).then(res => {
                if (currentValue === param.value) {
                    if (res.data.data) {
                        callback(res.data.data.rows);
                    } else {
                        callback([]);
                    }
                }
            });
        } else if (type === 1) {
            listVariable(requestData).then(res => {
                if (currentValue === param.value) {
                    if (res.data.data) {
                        callback(res.data.data.rows);
                    } else {
                        callback([]);
                    }
                }
            });
        } else if (type === 3) {
            functionList(requestData).then(res => {
                if (currentValue === param.value) {
                    if (res.data.data) {
                        callback(res.data.data.rows);
                    } else {
                        callback([]);
                    }
                }
            });
        } else if (type === 10) {
            referenceableList(requestData).then(res => {
                if (currentValue === param.value) {
                    if (res.data.data) {
                        callback(res.data.data.rows);
                    } else {
                        callback([]);
                    }
                }
            });
        }
    }

    timeout = setTimeout(fake, 300);
}
