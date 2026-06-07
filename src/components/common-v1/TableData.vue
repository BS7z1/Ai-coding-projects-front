<template>
    <cb-container style = "height: 100%">
        <cb-main ref="tableMain" style="height: 100%">
            <cb-table
                class="tableData"
                :data="tableData"
                @row-dblclick = "showDetail"
                :header-cell-style="{textAlign:'center',background:'#f5f7fa',color:'#606266',fontSize:'14px'}"
                :cell-style="{textAlign:'center'}"
                :row-style="{height:'20px'}"
                stripe
                border
                height="500"
                size="small"
                ref="tableSample"
                @selection-change="handleSelectionChange"
            >
                <cb-table-column type="selection" width="30" v-if="!hideSelection"></cb-table-column>
                <template v-for="tableHead in tableHeads">
                    <cb-table-column
                        :key="tableHead.dataName"
                        :prop="tableHead.dataName"
                        :label="tableHead.showName"
                        :width="tableHead.width"
                        sortable
                        style="text-align:center"
                    >
                        <template slot-scope="{row}">
                            {{row[tableHead.dataName] | desensitize(tableHead.columnTypeClass.desenseType)}}
                        </template>
                    </cb-table-column>
                </template>
                <cb-table-column v-if="operators.data !== undefined && operators.data.length !=0" label="操作" :width="operators.width" fixed="right">
                    <template slot-scope="scope">
                        <cb-row
                          v-for="(operatorArray, index) in operators.data"
                          :key="index"
                          type="flex"
                          class="row-bg"
                          justify="space-between"
                          style="margin-bottom: 2px;"
                        >
                            <cb-col v-for="(operator, ind) in operatorArray" :key="ind">
                                <template v-if="operator.status !== undefined">
                                    <template v-if="scope.row[operator.status]">
                                        <template v-if="operator.method == 'editRow'">
                                            <cb-button
                                                type="primary"
                                                size="mini"
                                                @click="handleOperator(scope.$index, scope.row, operator.method)"
                                            >
                                                {{ operator.operator }}
                                            </cb-button>
                                        </template>
                                        <template v-else>
                                            <cb-button
                                                type="danger"
                                                size="mini"
                                                @click="handleOperator(scope.$index, scope.row, operator.method)"
                                            >
                                                {{ operator.operator }}
                                            </cb-button>
                                        </template>
                                    </template>
                                </template>
                                <template v-else>
                                    <template v-if="operator.method == 'editRow'">
                                        <cb-button
                                            type = "plain"
                                            size = "mini"
                                            icon = "iconfont cb-icon-contact-offline-register"
                                            @click = "handleOperator(scope.$index, scope.row, operator.method)"
                                        >
                                            {{ operator.operator }}
                                        </cb-button>
                                    </template>
                                    <template v-else>
                                        <cb-button
                                            type = "primary"
                                            size = "mini"
                                            icon = "iconfont cb-icon-subtrsct-outline"
                                            @click = "handleOperator(scope.$index, scope.row, operator.method)"
                                        >
                                            {{ operator.operator }}
                                        </cb-button>
                                    </template>
                                </template>
                            </cb-col>
                        </cb-row>
                    </template>
                </cb-table-column>
            </cb-table>
        </cb-main>
        <!-- 分页功能 -->
         <cb-footer style="height: 10%;">
            <cb-pagination
                style="margin-top: 5px"
                @size-change="handleSizeChange"
                :total="pager.totalRows"
                @current-change="handleCurrentChange"
                :current-page="pager.currentPage"
                :page-sizes="pageSizes"
                :page-size="pager.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
            >
            </cb-pagination>
         </cb-footer>
    </cb-container>
</template>

<script>
import * as desense from '@/utils/desensitize'
export default{
    props:[
        'tableHeads', 'tableData', 'hideSelection', 'operators', 'pageSizes', 'pager', 'param'
    ],
    data(){
        return {
            loading: true,
            isSizeChange: false
        }
    },
    created(){

    },
    watch:{
        tableData(){
            this.$nextTick(()=>{this.$refs.tableSample.doLayout()})
        }
    },
    methods:{
        handleSelectionChange(val){
            this.$emit('selections', val)
        },
        handleOperator(index, row, method){
            this.$emit(method, {index: index, data: row, param: this.param})
            console.log('param', this.param)
        },
        handleSizeChange(val){
            if(this.pager.currentPage * val - this.pager.totalRows >= val){
                this.isSizeChange = true
            }
            let data={
                'currentPage': this.pager.currentPage,
                'pageSize': val,
                'param': this.param
            }
            this.$emit('sizeChange', data)
        },
        handleCurrentChange(val){
            if(this.isSizeChange){
                this.isSizeChange = false
            }else{
                let data = {
                    'currentPage': val,
                    'pageSize': this.pager.pageSize,
                    'param': this.param
                }
                this.$emit('currentChange', data)
            }
        },
        showDetail(column){
            this.$emit('showDetail', column)
        }
    },
    filters:{
        desensitize: function(value, desenseType){
            let tmpValue
            switch(desenseType){
                case 0:
                    tmpValue = value
                    break
                case 1:
                    tmpValue = desense.desensitizeCertID(value)
                    break
                case 2:
                    tmpValue = desense.desensitizeName(value)
                    break
                case 3:
                    tmpValue = desense.desensitizeCardNo(value)
                    break
                case 4:
                    tmpValue = desense.desensitizeMoblie(value)
                    break
                case 5:
                    tmpValue = desense.desensitizeAddress(value)
                    break
                case 6:
                    tmpValue = desense.desensitizeDefault(value)
                    break
                default:
                    tmpValue = value
            }
            return tmpValue
        }
    }
}
</script>
<style scoped>
</style>