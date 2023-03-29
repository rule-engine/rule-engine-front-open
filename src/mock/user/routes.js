import Mock from 'mockjs'

Mock.mock(`/api/routes`, 'get', () => {
    let result = {}
    result.code = 200
    result.data = [{
        router: 'root',
        children: [
            {
                router: 'dashboard',
                children: ['workplace', 'analysis'],
            },
            {
                router: 'form',
                children: ['basicForm', 'stepForm', 'advanceForm']
            },
            {
                router: 'basicForm',
                name: '验权表单',
                icon: 'file-excel',
                authority: 'queryForm'
            },
            {
                router: 'antdv',
                path: 'antdv',
                name: 'Ant Design Vue',
                icon: 'ant-design',
                link: 'https://www.antdv.com/docs/vue/introduce-cn/'
            },
            {
                router: 'document',
                path: 'document',
                name: '使用文档',
                icon: 'file-word',
                link: 'https://iczer.gitee.io/vue-antd-admin-docs/'
            }
        ]
    }]
    return result
})
