<template>
    <cb-drawer :visible.sync="open" direction="rtl" :size="drawerSize" :before-close="handleClose">
        <template slot="title">
            <cb-page-header @back="close()" :content="type"></cb-page-header>
        </template>
        <div>
            <edit-Object
             :originObject="this.editPara"
             :tableForm="this.tableForm"
             :loading="loading"
             :colNum="this.colNum"
             :isEdit='this.isPermissEdit'
             :labelWidth = 'this.labelWidth'
             :labelPosition = 'this.labelPosition'
             @close = "close"
             @saveObj = "save"
            />
        </div>
    </cb-drawer>
</template>
<script>
import { sendDwrRequest } from '@api/app'
import Edit from '@/components/common-v1/Edit'
export default{
    props: [
        'open', // 表示弹窗组件是否开启
        'drawerSize', // 表示抽屉大小
        'type', // 表示编辑类型：新增、编辑
        'editPara', // 表示 Edit 组件展示的数据
        'tableForm', // 表示 Edit 组件展示的字段信息
        'editSaveUri', // 表示后端编辑接口 uri
        'addSaveUri', // 表示后端新增接口 uri
        'paraName', // 表示后端编辑接口及保存接口的参数名称
        'colNum', // 表示每行显示的列数
        'labelWidth', // 表示编辑框宽度，可是只为 px
        'labelPosition', // 表示编辑框 label 位置，可设置为 top/left/right
    ],
    components:{
        'edit-Object': Edit
    },
    data(){
        return {
            editConfig: [],
            loading: false,
            isPermissEdit: false
        }
    },
    created(){

    },
    watch:{
        type(newVal, oldVal){
            if(newVal==='编辑'){
                this.isPermissEdit = true
            }else{
                this.isPermissEdit = false
            }
        }
    },
    methods: {
        handleClose(){
            this.$emit('close')
        },
        close(){
            this.$emit('close')
        },
        validatePass(){
            alert("hello")
        },
        save(data){
            let uri = ''
            let params ={}
            params[this.paraName] = JSON.stringify(data)
            let alertMsg = ''
            if(this.type==='编辑'){
                uri = this.editSaveUri
                alertMsg = '编辑成功'
            }else{
                uri = this.addSaveUri
                alertMsg = '新增成功'
            }
            sendDwrRequest(uri, params).then(res=>{
                if(res.data.success){
                    this.$notify({
                        title: '成功',
                        message: alertMsg,
                        type: 'success',
                        duration: 5000
                    })
                    this.$emit('save')
                }else{
                    this.$notify.error({
                        title: '错误',
                        message: res.data.message,
                        duration: 5000,
                        customClass: 'http-message'
                    })
                }
            })
        },
    }
}
</script>
<style>
.http-message{
    z-index: 3000!important;
}
</style>