import Cookie from 'js-cookie'
import {setAuthorization, removeAuthorization} from "@/utils/request";
import vueMain from '@/main.js'

// 401拦截
const resp401 = {
    /**
     * 响应数据之前做点什么
     * @param response 响应对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {*}
     */
    onFulfilled(response, options) {
        const {message} = options
        if (response.code === 401) {
            message.error('无此权限')
        }
        return response
    },
    /**
     * 响应出错时执行
     * @param error 错误对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {Promise<never>}
     */
    onRejected(error, options) {
        const {message} = options
        const {response} = error
        if (response.status === 401) {
            message.error('无此权限')
        }
        return Promise.reject(error)
    }
}


const resp403 = {
    onFulfilled(response, options) {
        const {message} = options
        if (response.code === 403) {
            message.error('请求被拒绝')
        }
        return response
    },
    onRejected(error, options) {
        const {message} = options
        const {response} = error
        if (response.status === 403) {
            message.error('请求被拒绝')
        }
        return Promise.reject(error)
    }
}

// 业务错误拦截
const respServiceError = {
    /**
     * 响应数据之前做点什么
     * @param response 响应对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {*}
     */
    onFulfilled(response, options) {
        const {message} = options
        let token = response.headers.token;
        let data = response.data;
        let code = data.code;
        let errMsg = data.message;

        if (token != null) {
            setAuthorization({token: token, expireAt: new Date(new Date().getTime() + 500 * 365 * 24 * 60 * 60 * 1000)})
        }
        if (code === 4009 || code === 10010002 || code === 10010004 || code === 99990402 || code === 10011039) {
            message.warn(errMsg)
            removeAuthorization()
            setTimeout(() => location.reload(), 1500)
        } else if (code === 9999404) {
            //数据没查到
            vueMain.$router.replace({path: '/subError', params: {message: errMsg}})
        } else if (code !== 200
            && code //mock不拦截 @todo 开发完毕要去掉
        ) {
            message.error(errMsg)
        }
        return response

    },
    /**
     * 响应出错时执行
     * @param error 错误对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {Promise<never>}
     */
    onRejected(error, options) {
        const {message} = options
        const {response} = error
        if (response.status === 500) {
            message.error('服务器出现了一点小问题,请稍后再试哦～')
        }
        if (response.status === 404) {
            message.error('404 找不到服务了～')
        }
        return Promise.reject(error)
    }
}

const reqCommon = {
    /**
     * 发送请求之前做些什么
     * @param config axios config
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {*}
     */
    onFulfilled(config, options) {
        const {message} = options
        const {url, xsrfCookieName} = config
        if (url.indexOf('login') === -1 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
            message.warning('认证 token 已过期，请重新登录')
        }
        return config
    },
    /**
     * 请求出错时做点什么
     * @param error 错误对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {Promise<never>}
     */
    onRejected(error, options) {
        const {message} = options
        // const {response} = error
        message.error(error.message)
        return Promise.reject(error)
    }
}

export default {
    request: [reqCommon], // 请求拦截
    response: [resp401, resp403, respServiceError] // 响应拦截
}
