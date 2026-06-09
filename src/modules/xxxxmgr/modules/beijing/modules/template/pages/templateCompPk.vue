<template>
    <cb-container style="height: calc(100vh - 100px); overflow-y: auto;" class="containerBox">
        <cb-header style="height: auto;">
            <cb-collapse value="1" class="collapseBox">
                <cb-collapse-item title="高级查询" name="1" class="collapse-item-Box">
                    <query-form 
                     :table-form="tableForm" 
                     :advancedDefaultParams="advancedDefaultParams" 
                     :colNum="queryFormColNum" 
                     :labelWidth="queryLabelWidth" 
                     :labelPosition="queryLabelPosition" 
                     :operators="queryFormOperators" 
                     @query="advancedQuery"
                    ></query-form>
                </cb-collapse-item>
            </cb-collapse>
            <cb-button 
             type="primary" 
             size="mini" 
             icon="iconfont cb-icon-add" 
             @click="addRow"
            >新增</cb-button>
            <cb-button 
             type="primary" 
             size="mini" 
             icon="iconfont cb-icon-trash" 
             @click="deleteRows" 
             style="margin-top: 10px;"
            >批量删除</cb-button>
        </cb-header>
        <cb-container style="height: 100%;" class="container-table-Box">
            <table-data
             class="tableBox"
             v-loading="loading"
             :tableHeads="tableHeads"
             :tableData="tableData"
             :pager="pager"
             :pageSizes="pageSizes"
             :operators="operators"
             @sizeChange="handleSizeChange"
             @currentChange="handleCurrentChange"
             @editRow="editRow"
             @deleteRow="deleteRow"
             @showDetail="showDetail"
             @selections="handleSelectionChange"
            />
            <detail 
             :params="detailParams"
             :uri="detailUri"
             :visible="detailVisible"
             :tableHeads="detailTableHeads"
             :colNum="detailColNum"
             :dialogWidth="detailDialogWidth"
             :labelWidth="detailLabelWidth"
             :textWidth="detailTextWidth"
            />
        </cb-container>
        <!-- 编辑侧弹窗 -->
        <edit-main
         :type="editType"
         :open="isOpen"
         :editPara="editPara"
         :tableForm="editTableForm"
         :editSaveUri="editSaveUri"
         :addSaveUri="addSaveUri"
         :paraName="paraName"
         :colNum="editMainColNum"
         :drawerSize="editDrawerSize"
         :labelWidth="editLabelWidth"
         :labelPosition="editLabelPosition"
         @save="save"
         @close="closeEdit"
        ></edit-main>
        <!-- 删除弹框 -->
        <delete
         :visible="deleteVisible"
         :confirmInfo="deleteConfirmInfo"
         :uri="deleteUri"
         :params="deleteParams"
         @refresh="refresh"
        />
    </cb-container>
</template>
<script>
import { sendDwrRequest, getColumnTypeEnum, getDesenseTypeEnum} from '@/api/app'
import QueryForm from '@/components/common-v1/QueryForm.vue'
import TableData from '@/components/common-v1/TableData.vue'
import Detail from '@/components/common-v1/Detail.vue'
import EditMain from '@/components/common-v1/EditMain.vue'
import Delete from '@/components/common-v1/Delete.vue'
export default {
  components: {
    'query-form': QueryForm,
    'table-data': TableData,
    'detail': Detail,
    'edit-main': EditMain,
    'delete': Delete

  },
  data(){
    let columnTypeEnum = getColumnTypeEnum()
    let desenseTypeEnum = getDesenseTypeEnum()
    return {
        tableForm: '',
        advancedDefaultParams: {},
        queryFormColNum: 4,
        queryLabelWidth: '150px',
        queryLabelPosition: 'right',
        queryFormOperators: { data:[] },
        loading: true,
        tableHeads:[],
        tableData:[],
        pager:{
            pageSize: 30,
            currentPage: 1,
            totalRows: 0,
            totalPages: 0,
            startRow: 1
        },
        pageSizes: [30, 50, 100],
        operators: {
            width: 200,
            data: [[{operator: '编辑', method: 'editRow'}, {operator: '删除', method: 'deleteRow'}]]
        },
        detailParams: null,
        detailUri: '/api/beijing/template/dwrTemplateCompPkService/getTemplateCompPkByPk',
        detailVisible: null,
        detailTableHeads: null,
        detailColNum: 2,
        detailDialogWidth: '80%',
        detailLabelWidth: '150px',
        detailTextWidth: '200px',
        editType: '新增',
        isOpen: false,
        editPara: {},
        editTableForm: null,
        editSaveUri: '/api/beijing/template/dwrTemplateCompPkService/updateTemplateCompPk',
        addSaveUri: '/api/beijing/template/dwrTemplateCompPkService/saveTemplateCompPk',
        paraName: 'templateCompPk',
        editMainColNum: 2,
        editDrawerSize: '50%',
        editLabelWidth: '150px',
        editLabelPosition: 'right',
        deleteVisible: false,
        deleteConfirmInfo: '',
        deleteUri: '/api/beijing/template/dwrTemplateCompPkService/deleteTemplateCompPkByPks',
        deleteParams: {},
        editParaDefault: {},
        editTableFormDefault: null,
        addTableFormDefault: null,
        advancedParams: {},
        advancedQueryUri: '/api/beijing/template/dwrTemplateCompPkService/listTemplateCompPk',
        selections: [],
        
        // 字段校验方法，对 编辑、新增有效
        // 校验方法样例1:方法定义在data，rule定义在rawParams
        // var validateMethod = (rule, value, callback)=>{
        //     if(value==='1'){
        //         callback(new Error('请输入xxx'))
        //     }else{
        //         callback()
        //     }
        // }
        // rule: [{validator: validateMethod, trigger: 'blur'}]
        // 校验方法样例2:rule放在rawParams中
        // rule: [{required: true, message: '请输入xxx' trigger: 'blur'}]
        
        // 查询字段校验方法，对 高级查询有效
        // queryRule: [{required: true, message: '请输入xxx' trigger: 'blur'}]

        // 多选框定义方法
        // columnTypeClass: {
        //     columnType: columnTypeEnum.TYPE_SELECT,
        //     list:[
        //         { label: '多选项一', value: 'Option1', isChecked: false},
        //         { label: '多选项二', value: 'Option2', isChecked: true}
        //     ],
        //     desenseType: desenseTypeEnum.TYPE_UNDESENSE
        // }

        rawParams:[
            {
                dataName: 'primaryKey-tskId',
                showName: '流水号',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                editDisabled: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_TEXT,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'primaryKey-loanId',
                showName: '借据号',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_TEXT,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'companyName',
                showName: '公司名称',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_TEXT,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'creditCode',
                showName: '企业统一信用代码',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_TEXT,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'amount',
                showName: '借据金额（元）',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_TEXT,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'interestRate',
                showName: '利率（%）',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_TEXT,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'isValid',
                showName: '是否有效',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_SELECT,
                    list:[
                        { label: '否', value: '0', isChecked: false},
                        { label: '是', value: '1', isChecked: false}
                    ],
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'empNo',
                showName: '用户工号',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_TEXT,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'empNm',
                showName: '用户名称',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_TEXT,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'startTm',
                showName: '起始时间',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_DATE,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            },
            {
                dataName: 'updatedTm',
                showName: '更新时间',
                showColumn: 'true',
                showAdd: 'true',
                showAdvanced: 'true',
                showDetail: 'true',
                showEdit: 'true',
                columnTypeClass: {
                    columnType: columnTypeEnum.TYPE_DATE_TIME,
                    desenseType: desenseTypeEnum.TYPE_UNDESENSE
                }
            }
        ]
    }
  },
  created: function(){
    let realTableHeads = []
    let realDetailTableHeads = []
    let realEditTableFormDefault = []
    let realAddTableFormDefault = []
    let realEditParaDefault = {}
    for (let i = 0; i < this.rawParams.length; i++){
        let temp = this.rawParams[i]
        if(temp.showColumn){
            realTableHeads.push(temp)
        }
        if(temp.showDetail){
            realDetailTableHeads.push(temp)
        }
        realEditTableFormDefault.push(temp)
        realAddTableFormDefault.push(temp)
        realEditParaDefault[temp.dataName] = null
    }
    this.tableHeads = realTableHeads
    this.detailTableHeads = realDetailTableHeads
    this.editTableFormDefault = realEditTableFormDefault
    this.addTableFormDefault = realAddTableFormDefault
    this.editParaDefault = realEditParaDefault
    this.editTableForm = this.editTableFormDefault
    let data = this.rawParams
    let len = data.length
    let tempTableForm = []
    for(let i = 0; i<len; i++){
        if(data[i].showAdvanced){
            tempTableForm.push(data[i])
        }
    }
    this.advancedDefaultParams = realEditParaDefault
    this.tableForm = tempTableForm
    this.getData(this.pager.currentPage, this.pager.pageSize)
  },
  methods:{
    getData(currentPage, pageSize){
        let uri = this.advancedQueryUri
        let allParams = this.advancedParams
        let copy = {}
        for(let key in allParams){
            let keyArray = key.split('-')
            let len = keyArray.length
            let value = allParams[key]
            if(len>1){
                let count = len - 1
                let temp = value
                while(count>0){
                    let newTemp = {}
                    newTemp[keyArray[count]] = temp
                    temp = newTemp
                    count = count - 1
                }
                copy[keyArray[0]] = temp
            }else{
                copy[key] = value
            }
        }
        let pagerParams = {
            'totalRows': this.pager.totalRows,
            'pageSize': pageSize,
            'currentPage': currentPage,
            'totalPages': Math.ceil(this.pager.totalRows/pageSize),
            'startRow': currentPage === 1?1:this.pager.startRow
        }
        let params = {
            templateCompPk: JSON.stringify(copy),
            pager: JSON.stringify(pagerParams)
        }
        sendDwrRequest(uri, params).then(res=>{
            if(res.data.success){
                let list = res.data.resultList
                let tempTableData = []
                let len = list.length
                let rawParamsLen = this.rawParams.length
                for(let i = 0; i <len; i++){
                    let listEle = list[i]
                    let newEle = {}
                    for(let j = 0; j < rawParamsLen; j++){
                        let rawParam = this.rawParams[j]
                        let dataName = rawParam.dataName
                        let valueMapList = rawParam.columnTypeClass
                        let value = this.getRealObj(listEle, dataName, valueMapList)
                        this.$set(newEle, dataName, value)                        
                    }
                    this.$set(newEle, 'primaryKey', listEle['primaryKey'])
                    tempTableData.push(newEle)
                }
                this.tableData = tempTableData
                this.pager = res.data.pager
                this.loading = false
            }else{
                this.loading = false
            }
        })
    },
    getRealObj(obj, name, columnTypeClass){
        let nameArr = name.split('-')
        let len = nameArr.length
        let tempObj = obj
        for(let i=0; i<len; i++){
            tempObj = tempObj[nameArr[i]]
        }
        if(columnTypeClass.list!==undefined && columnTypeClass.list.length>0){
            let mapListLen = columnTypeClass.list.length
            for(let i=0; i<mapListLen; i++){
                let temp = columnTypeClass.list[i]
                if(tempObj != temp.value){
                    continue
                }else{
                    return temp.label
                }
            }
            if(columnTypeClass.default !== undefined){
                return columnTypeClass.default
            }
        }
        return tempObj
    },
    addRow(){
        this.editType = '新增'
        this.isOpen = true
        this.editPara = this.editParaDefault
        this.editTableForm = this.addTableFormDefault
    },
    advancedQuery(inputAdvancedParams){
        this.advancedParams = inputAdvancedParams
        this.getData(this.pager.currentPage, this.pager.pageSize)
    },
    deleteRows(){
        let len = this.selections.length
        let datas = []
        let confirmInfo = "是否删除这些数据？"
        for(let i = 0; i<len; i++){
            datas[i] = this.selections[i].primaryKey
        }
        this.deleteParams = {
            pks: JSON.stringify(datas)
        }
        this.deleteVisible = !this.deleteVisible
        this.deleteConfirmInfo = confirmInfo
    },
    handleSizeChange(data){
        this.loading = true
        this.getData(1, data.pageSize)
    },
    handleCurrentChange(data){
        this.loading = true
        this.getData(data.currentPage, data.pageSize)
    },
    editRow(data){
        this.editType = '编辑'
        this.isOpen = true
        this.editPara = data.data
        this.editTableForm = this.editTableFormDefault
    },
    deleteRow(data){
        let tempDeleteParams = []
        tempDeleteParams[0] = data.data.primaryKey
        this.deleteParams = {
            pks: JSON.stringify(tempDeleteParams)
        }
        this.deleteVisible = !this.deleteVisible
        this.deleteConfirmInfo = '是否删除？'
    },
    showDetail(data){
        let primaryKey = data.primaryKey
        this.detailVisible = !this.detailVisible
        this.detailParams = { 'pk': primaryKey }
    },
    handleSelectionChange(selections){
        this.selections = selections
    },
    save(isSaved){
        if(isSaved){
            this.isOpen = false
            this.getData(this.pager.currentPage, this.pager.pageSize)
        }
    },
    closeEdit(){
        this.isOpen = false
        this.editPara = null
    },
    refresh(){
        this.getData(this.pager.currentPage, this.pager.pageSize)
    },
  }
}
</script>
<style scoped>
.containerBox{
    flex-direction: column;  /* 外部环境保留，内部请注解 */
}
.collapseBox{
    background-color: white !important;
    border-bottom: 1px solid rgb(214, 214, 214);
}
.collapse-item-Box{
    padding-left: 12px !important
}
.container-table-Box{
    height: auto;
    display: block;
}
.tableBox{
    height: 100%;
    width: 100%;
}
.el-table__body-wrapper is-scrolling-left{
    height: 800px !important;
    white-space: nowrap;
}
</style>