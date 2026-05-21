<template>
    <cb-dialog
     title="确认信息"
     :visible.sync="innerVisible"
     width="40%"
    >
    <span>
        <b>删除信息为：</b>
        {{ confirmInfo }}
    </span>
    <span slot="footer" class="dialog-footer">
        <cb-button @click="innerVisible=false">取 消</cb-button>
        <cb-button type="primary" @click="handleDelete">确 定</cb-button>
    </span>
    </cb-dialog>
</template>
<script>
import { sendDwrRequest } from '@/api/app'
export default {
    props: [
        'visible',
        'confirmInfo',
        'uri',
        'params'
    ],
    data(){
        return {
            innerVisible: false
        }
    },
    watch:{
        visible(){
            this.innerVisible = true
        }
    },
    methods:{
        handleDelete(){
            sendDwrRequest(this.uri, this.params).then(res=>{
                if(res.data.success){
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success',
                        duration: 5000
                    })
                    this.$emit('refresh')
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.message,
                        duration: 5000
                    })
                }
                this.innerVisible = false
            })
        } 
    }

}
</script>
<style scoped>
</style>