import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import ElementUI from 'element-ui'
import { getColumnTypeEnum } from '@/api/app'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI, {
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  Option,
  DatePicker,
  TimePicker,
  Button,
  Row,
  Col,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  Cascader,
  Container,
  Main,
  Footer,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  Drawer,
  PageHeader,
  Card,
  Upload,
  Alert,
  Tag,
  Tabs,
  TabPane
} from 'element-ui'

Vue.use(ElementUI)

Vue.component('cb-form', Form)
Vue.component('cb-form-item', FormItem)
Vue.component('cb-input', Input)
Vue.component('cb-select', Select)
Vue.component('cb-option', Option)
Vue.component('cb-date-picker', DatePicker)
Vue.component('cb-time-picker', TimePicker)
Vue.component('cb-button', Button)
Vue.component('cb-row', Row)
Vue.component('cb-col', Col)
Vue.component('cb-checkbox', Checkbox)
Vue.component('cb-checkbox-group', CheckboxGroup)
Vue.component('cb-radio', Radio)
Vue.component('cb-radio-group', RadioGroup)
Vue.component('cb-switch', Switch)
Vue.component('cb-cascader', Cascader)
Vue.component('cb-container', Container)
Vue.component('cb-main', Main)
Vue.component('cb-footer', Footer)
Vue.component('cb-table', Table)
Vue.component('cb-table-column', TableColumn)
Vue.component('cb-pagination', Pagination)
Vue.component('cb-scrollbar', {
  render(h) {
    return h('div', this.$slots.default)
  }
})
Vue.component('cb-dialog', Dialog)
Vue.component('cb-drawer', Drawer)
Vue.component('cb-page-header', PageHeader)
Vue.component('cb-card', Card)
Vue.component('cb-upload', Upload)
Vue.component('cb-alert', Alert)
Vue.component('cb-tag', Tag)
Vue.component('cb-tabs', Tabs)
Vue.component('cb-tab-pane', TabPane)

Vue.prototype.columnTypeClass = getColumnTypeEnum()

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
