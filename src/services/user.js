import {user, ROUTES} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param username 账户名
 * @param password 账户密码
 */
export async function login(username, password) {
    return request(user.LOGIN, METHOD.POST, {
        username: username,
        password: password
    })
}

/**
 * 获取用户信息
 */
export async function getUserInfo() {
    return request(user.GET_USER_INFO, METHOD.POST)
}

/**
 * 检查用户名是否可用
 * @param param
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function verifyUserName(param) {
    return request(user.VERIFY_USER_NAME, METHOD.POST, param)
}

/**
 * 检查邮箱是否可用
 * @param param
 * @returns {Promise<AxiosResponse<any>>}
 */
export async function verifyckEmail(param) {
    return request(user.VERIFY_EMAIL, METHOD.POST, param)
}
export async function userList(param) {
    return request(user.LIST, METHOD.POST, param)
}

export async function addUser(param) {
    return request(user.ADD_USER, METHOD.POST, param)
}

export async function deleteUser(param) {
    return request(user.DELETE_USER, METHOD.POST, param)
}

export async function updateUserInfo(param) {
    return request(user.UPDATE_USER_INFO, METHOD.POST, param)
}

export async function selectUserById(param) {
    return request(user.SELECT_USER_BY_ID, METHOD.POST, param)
}

export async function uploadAvatar(param) {
    return request(user.UPLOADAVATAR, METHOD.POST, param)
}

export async function getRoutesConfig() {
    return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout(context) {
    localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
    localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
    localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
    localStorage.removeItem(process.env.VUE_APP_WORKSPACE_KEY)
    removeAuthorization();
    context.$router.push('/login')
}

export default {
    login,
    logout,
    getRoutesConfig,
    userList
}
