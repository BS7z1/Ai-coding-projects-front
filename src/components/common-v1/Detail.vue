<template>
    <cb-dialog
     title="详细信息"
     :visible.sync="innerVisible"
     :width = "dialogWidth"
     class="titleBox">
     <template v-if="arr!==null">
        <template v-for="(row, rowIndex) in arr">
            <cb-row :span="24" :key="rowIndex">
                <template v-for="column in row">
                    <cb-col :key="column.key" :span="24/colNum">
                        <div :key="column.key">
                            <span :title="column.label">
                                <b :style="'width:'+labelWidth+';'" class="details-text">{{ column.label }}</b>
                                <span :title="column.value" :style="'width:'+textWidth+';'" class="title-text">{{ column.value }}</span>"
                            </span>
                        </div>
                    </cb-col>
                </template>
            </cb-row>
        </template>
     </template>
     <template v-else>
        <span>无详情信息</span>
     </template>
     <span slot="footer" class="dialog-footer">
        <cb-button type="primary" @click="innerVisible = false">确 定</cb-button>
     </span>
    </cb-dialog>
</template>
<script>
import {sendDwrRequest} from '@/api/app'
export default {
    props: [
        'visible',
        'colNum',
        'uri',
        'params',
        'tableHeads',
        'dialogWidth',
        'labelWidth',
        'textWidth'
    ],
    data(){
        return {
            innerVisible: false,
            arr: []
        }
    },
    watch: {
        visible(){
            this.innerVisible = true
        },
        params(){
            let result = []
            if(this.params!==null && this.params.length!==0){
                sendDwrRequest(this.uri, this.params).then(res=>{
                    let datas = res.data.resultList[0]
                    let len = this.tableHeads.length
                    let row = 0
                    let col = 0
                    for(let i=0;i<len;i++){
                        row = Math.floor(i/this.colNum)
                        col = i%this.colNum
                        let column = []
                        if(col===0){
                            result[row] = column
                        }else{
                            column=result[row]
                        }
                        let valueArr = this.tableHeads[i].dataName.split('-')
                        let value = datas
                        for(let i=0; i<valueArr.length; i++){
                            let tempValue = value[valueArr[i]]
                            value = tempValue
                        }
                        column[col] = {
                            key: this.tableHeads[i].dataName,
                            label: this.tableHeads[i].showName,
                            value: value
                        }
                    }
                    this.arr = result
                })
            }
        }
    }
}
</script>
<style scoped>
.titleBox{
    border: 1px solid red;
}
.title-text{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px dotted #BDBCBC;
    font-size: 12px;
}
.details-text{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
}
</style>
