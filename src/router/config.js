import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
// import PageView from '@/layouts/PageView'

// 路由配置
const options = {
    routes: [
        {
            path: '/login',
            name: '登录页',
            component: () => import('@/pages/login')
        },
        {
            path: '*',
            name: '404',
            component: () => import('@/pages/exception/404'),
        },
        {
            path: '/403',
            name: '403',
            component: () => import('@/pages/exception/403'),
        },
        {
            path: '/',
            name: '首页',
            component: TabsView,
            redirect: '/dashboard/workplace',
            children: [
                {
                    path: '/subError',
                    name: '操作失败',
                    meta: {
                        invisible: true
                    },
                    component: () => import('@/pages/result/Error'),
                },
                {
                    path: 'dashboard',
                    name: '控制台',
                    meta: {
                        icon: 'dashboard'
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'workplace',
                            name: '工作台',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/dashboard/workplace'),
                        },
                        // {
                        //     path: 'analysis',
                        //     name: '监控',
                        //     meta: {
                        //         page: {
                        //             closable: true
                        //         }
                        //     },
                        //     component: () => import('@/pages/dashboard/analysis'),
                        // }
                    ]
                },
                {
                    path: 'components',
                    name: '组件',
                    meta: {
                        icon: 'gold'
                    },
                    component: BlankView,
                    children: [
                        {
                            path: '/Inputparameter',
                            name: '参数',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/components/Inputparameter'),
                        },
                        {
                            path: '/variable',
                            name: '变量',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/components/variable'),
                        },
                        {
                            path: '/function',
                            name: '函数',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/components/function'),
                        },
                    ]
                },
                {
                    path: 'rulemanagement',
                    name: '规则管理',
                    meta: {
                        icon: 'appstore'
                    },
                    component: BlankView,
                    children: [
                        {
                            path: '/generalrule',
                            name: '普通规则',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/rulemanagement/generalrule/list'),
                        },
                        {
                            path: '/generalRuleRouter/:id',
                            name: '规则(...)',
                            meta: {
                                invisible: true
                            },
                            component: () => import('@/pages/rulemanagement/generalrule/router'),
                        },
                        {
                            path: '/generalRuleView/:id/:version',
                            name: '规则(...)',
                            meta: {
                                invisible: true
                            },
                            component: () => import('@/pages/rulemanagement/generalrule/view'),
                        },
                    ]
                },
                {
                    path: 'settings',
                    name: '系统设置',
                    meta: {
                        icon: 'setting'
                    },
                    component: BlankView,
                    children: [
                        {
                            path: 'user',
                            name: '用户列表',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/settings/user')
                        },
                        {
                            path: 'workspace',
                            name: '工作空间',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/settings/workspace')
                        },
                        {
                            path: 'personal',
                            name: '个人中心',
                            meta: {
                                page: {
                                    closable: true
                                }
                            },
                            component: () => import('@/pages/settings/personal')
                        },
                    ]
                },
                {
                    name: '使用文档',
                    path: 'document',
                    meta: {
                        icon: 'file-word',
                        link: 'http://ruleengine.cn/doc'
                    }
                }
            ]
        },
    ]
};

export default options
