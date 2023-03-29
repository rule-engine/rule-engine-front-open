import Vue from 'vue'
import App from './App.vue'
import {initRouter} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
import VueCropper from 'vue-cropper'
import vueScroll from "vuescroll";//引入vuescroll
import "vuescroll/dist/vuescroll.css";//引入vuescroll样式
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.use(VueCropper)
Vue.use(vueScroll, {
    ops: {}, // 在这里设置全局默认配置
    name: 'vue-scroll' // 在这里自定义组件名字，默认是vueScroll
});//使用

Vue.use(VXETable)
bootstrap({router, store, i18n, message: Vue.prototype.$message})

let vueMain = new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
}).$mount('#app')

export default vueMain
