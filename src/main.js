import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, {
  Form,
  FormItem,
  Input,
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
  Pagination
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { getColumnTypeEnum } from '@/api/app'

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

Vue.prototype.columnTypeClass = getColumnTypeEnum()

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
