// 视图组件
const view = {
    tabs: () => import('@/layouts/tabs'),
    blank: () => import('@/layouts/BlankView'),
    page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
    login: {
        authority: '*',
        path: '/login',
        component: () => import('@/pages/login')
    },
    root: {
        path: '/',
        name: '首页',
        redirect: '/login',
        component: view.tabs
    },
    dashboard: {
        name: '控制台',
        component: view.blank
    },
    workplace: {
        name: '工作台',
        component: () => import('@/pages/dashboard/workplace')
    },
    analysis: {
        name: '监控',
        component: () => import('@/pages/dashboard/analysis')
    },
    ruleManagement: {
        name: '规则管理',
        component: view.blank
    },
    generalRuleList: {
        path: '/generalRuleList',
        name: 'generalRuleList',
        component: () => import('@/pages/rulemanagement/generalrule/list'),
    },
    form: {
        name: '表单页',
        icon: 'form',
        component: view.page
    },
    list: {
        name: '列表页',
        icon: 'table',
        component: view.page
    },
    details: {
        name: '详情页',
        icon: 'profile',
        component: view.blank
    },
    result: {
        name: '结果页',
        icon: 'check-circle-o',
        component: view.page
    },
    success: {
        name: '成功',
        component: () => import('@/pages/result/Success')
    },
    error: {
        name: '失败',
        component: () => import('@/pages/result/Error')
    },
    exception: {
        name: '异常页',
        icon: 'warning',
        component: view.blank
    },
    exp403: {
        authority: '*',
        name: 'exp403',
        path: '403',
        component: () => import('@/pages/exception/403')
    },
    exp404: {
        name: 'exp404',
        path: '404',
        component: () => import('@/pages/exception/404')
    },
    exp500: {
        name: 'exp500',
        path: '500',
        component: () => import('@/pages/exception/500')
    },
    components: {
        name: '小组件',
        icon: 'appstore-o',
        component: view.page
    },
}
export default routerMap

