<template>
    <cb-main :style="{height: windowHeight}">
        <cb-scrollbar class="editClass" style="height: 90%;">
            <cb-form
              v-if="tableForm!=null && tableForm.length>0 && originObject!=null"
              ref="form"
              :inline="true"
              :model="formModelAccess"
              :rules="rules"
              :label-width="labelWidth"
              :label-position="labelPosition"
            >
                <cb-row v-for="(formItems, index) in formObj" :key="index">
                    <cb-col :span="24/colNum" v-for="(formItem, index) in formItems" :key="index">
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_CHECKBOX"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-checkbox-group v-model="formModelAccess[formItem.dataName]" :disable="(!isEdit || formItem.editDisabled==undefined)?false: formItem.editDisabled">
                            <template v-for="(checkbox) in formItem.columnTypeClass.list">
                                <cb-checkbox
                                    :key="checkbox.label"
                                    :label="checkbox.label"
                                    :checked="checkbox.isChecked"
                                    :disabled="(!isEdit || checkbox.disabled==undefined)?false:checkbox.disabled"
                                ></cb-checkbox>
                            </template>
                        </cb-checkbox-group>    
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_RADIO"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-radio-group v-model="formModelAccess[formItem.dataName]" :disable="(!isEdit || formItem.editDisabled==undefined)?false: formItem.editDisabled">
                            <template v-for="(radio) in formItem.columnTypeClass.list">
                                <cb-radio
                                :key="radio.label"
                                :label="radio.label"
                                :checked="radio.isChecked"
                                :disabled="(!isEdit || radio.disabled==undefined)?false:radio.disabled"
                                >
                                </cb-radio>
                            </template>
                        </cb-radio-group>    
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_DATE"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-date-picker 
                        v-model="formModelAccess[formItem.dataName]"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        placeholder="选择日期"
                        :disabled="(!isEdit || formItem.editDisabled==undefined)?false:formItem.editDisabled"
                        ></cb-date-picker>    
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_SELECT"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-select 
                        v-model="formModelAccess[formItem.dataName]" 
                        filterable
                        clearable
                        placeholder="请选择"
                        :disabled="(!isEdit || formItem.editDisabled==undefined)?false:formItem.editDisabled"
                        >
                        <template v-for="option in (formItem.columnTypeClass.editList == undefined?formItem.columnTypeClass.list:formItem.columnTypeClass.editList)">
                            <cb-option
                            :key="option.label"
                            :label="option.label"
                            :value="option.value"
                            :selected="option.isChecked"
                            :disabled="(!isEdit || option.disabled==undefined)?false:option.disabled"
                            ></cb-option>
                        </template>
                        </cb-select>
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_TEXT"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-input v-model="formModelAccess[formItem.dataName]" webkitdirectory clearable placeholder="请输入内容" :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"></cb-input>
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_TEXTAREA"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-input type="textarea" v-model="formModelAccess[formItem.dataName]" webkitdirectory clearable placeholder="请输入内容" :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"></cb-input>
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_TIME"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-time-picker 
                        v-model="formModelAccess[formItem.dataName]"
                        value-format="HH:mm:ss"
                        format="HH:mm:ss"
                        placeholder="选择时间"
                        :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"
                        ></cb-time-picker> 
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_DATE_TIME"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-date-picker
                        type="datetime"
                        v-model="formModelAccess[formItem.dataName]"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"
                        ></cb-date-picker> 
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_YEAR_MONTH"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-date-picker
                        type="month"
                        v-model="formModelAccess[formItem.dataName]"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM"
                        placeholder="选择年月"
                        :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"
                        ></cb-date-picker> 
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.Type_ReadOnly"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-input v-model="formModelAccess[formItem.dataName]" webkitdirectory clearable placeholder="sdfsdfsd" disabled></cb-input>
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.Type_ReadOnly_DATE"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-input v-model="formModelAccess[formItem.dataName]" webkitdirectory clearable placeholder="sdfsdfsd" disabled></cb-input>
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_CASCADE"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-cascader
                        v-model="formModelAccess[formItem.dataName]" 
                        filterable
                        clearable
                        placeholder="请选择"
                        :options="formItem.columnTypeClass.list"
                        :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"
                        ></cb-cascader>
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_YEAR"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-date-picker 
                        v-model="formModelAccess[formItem.dataName]"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy"
                        placeholder="选择年月"
                        :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"
                        ></cb-date-picker>    
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_SWITCH"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-switch
                        v-model="formModelAccess[formItem.dataName]"
                        active-color="#D7000F"
                        inactive-color="#D6D6D6"
                        :active-text="formItem.columnTypeClass.active.text"
                        :active-value="formItem.columnTypeClass.active.value"
                        :inactive-text="formItem.columnTypeClass.inActive.text"
                        :inactive-value="formItem.columnTypeClass.inActive.value"
                        :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"
                        ></cb-switch>
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else-if="formItem.columnTypeClass.columnType === columnTypeClass.TYPE_DATE_RANGE"
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-date-picker 
                        v-model="formModelAccess[formItem.dataName]"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"
                        ></cb-date-picker>    
                    </cb-form-item>
                    <cb-form-item
                    :key="getLastFieldName(formItem.dataName)"
                    :label="formItem.showName"
                    :prop="getLastFieldName(formItem.dataName)"
                    v-else
                    v-show="!isEdit? true: formItem.showEdit"
                    >
                        <cb-input v-model="formModelAccess[formItem.dataName]" webkitdirectory clearable placeholder="请输入内容" :disabled="(!isEdit || formItem.editDisabled==undefined)?false:true"></cb-input>
                    </cb-form-item>
                    </cb-col>
                </cb-row>   
            </cb-form>
        </cb-scrollbar>
        <div style="height: 10%; margin-left: 40%;">
            <cb-button @click="close('form')">取 消</cb-button>
            <cb-button
             type="primary"
             @click="save('form')"
             :loading="loading"
            >{{ loading? '提交中…': '确 定' }}</cb-button>
        </div>
    </cb-main>
</template>
<script>
import { getColumnTypeEnum } from '@/api/app.js';
export default {
    name: 'edit',
    props: [
        'tableForm',
        'originObject',
        'labelWidth',
        'labelPosition',
        'colNum',
        'isEdit',
        'loading',
        'visible'
    ],
    computed: {
        formObj(){
            let forms = []
            let form = []
            let hiddenForm = []
            let i = 0
            for(let ind in this.tableForm){
                if(!this.isEdit){
                    if(!this.tableForm[ind].showAdd){continue}
                }else{
                    if(!this.tableForm[ind].showEdit){
                        hiddenForm.push(this.tableForm[ind])
                        continue
                    }
                }
                i+=1
                form.push(this.tableForm[ind])
                if(this.colNum === i){
                    forms.push(form)
                    form = []
                    i = 0
                }
            }
            if(form !== []){
                forms.push(form)
            }
            forms.push(hiddenForm)
            return forms        
        },
        rules(){
            let rules = {}
            for(let ind in this.tableForm){
                if(this.tableForm[ind].rule){
                    rules[this.tableForm[ind].dataName] = this.tableForm[ind].rule
                }
            }
            return rules
        }
    },
    data(){
        return {
            windowHeight: '',
            formModelAccess: {},
            columnTypeEnum: getColumnTypeEnum(),
            drawer: false,
            innerDrawer: false,
            innerVisible: false,
            clientHeight: '',
        }
    }, 
    mounted(){
        this.clientHeight = document.documentElement.clientHeight
        let that = this
        window.onresize = () =>{
            this.clientHeight = document.documentElement.clientHeight
            that.windowHeight = this.clientHeight - 120 + 'px' 
        }
    },
    watch: {
        clientHeight(){
            this.changeFixed(this.clientHeight)
        },
        originObject(){
            if(this.originObject!=null){
                let json = JSON.stringify(this.originObject)
                let copy = JSON.parse(json)
                let len = this.tableForm.length
                for(let i=0;i<len;i++){
                    let dataName = this.tableForm[i].dataName
                    let value = copy[dataName]
                    value = this.getMappingValue(value, this.tableForm[i])
                    this.$set(this.formModelAccess, dataName, value)
                }
            }
        }
    },
    created(){
        if(this.originObject!=null){
            let json = JSON.stringify(this.originObject)
            let copy = JSON.parse(json)
            let len = this.tableForm.length
            for(let i=0;i<len;i++){
                let dataName = this.tableForm[i].dataName
                let value = copy[dataName]
                value = this.getMappingValue(value, this.tableForm[i])
                this.$set(this.formModelAccess, dataName, value)
            }
        }
    },
    methods: {
        getLastFieldName(valueStr){
            let theStr = valueStr
            let valueStrs = theStr.split('\\.')
            if(valueStrs.length>1){
                theStr = valueStrs[valueStrs.length-1]
            }
            return theStr
        },
        save(form){
            this.$refs[form].validate((valid)=>{
                if(valid){
                    this.$emit('saveObj', this.getEmitForm())
                    this.$refs[form].resetFields()
                }else{
                    return false
                }
            })
        },
        getEmitForm(){
            let len = this.tableForm.length
            let tempFormModel = {}
            for(let i=0; i<len; i++){
                let temp = this.tableForm[i]
                let tempArr = temp.dataName.split('-')
                let tempArrLen = tempArr.length
                if(tempArrLen>1){
                    let tempObj = tempFormModel
                    for(let i=0; i<tempArrLen; i++){
                        if(tempObj[tempArr[i]]===undefined){
                            if(i < tempArrLen-1){
                                tempObj[tempArr[j]] = {}
                            }else{
                                tempObj[tempArr[j]] = this.formModelAccess[temp.dataName]
                            }
                        }
                        tempObj = tempObj[tempArr[i]]
                    }
                }else{
                    tempFormModel[temp.dataName] = this.formModelAccess[temp.dataName]
                }
            }
            return tempFormModel
        },
        close(form){
            this.$refs[form].resetFields()
            this.$emit('close')
        },
        getMappingValue(mappingValue, rawPara){
            let list = rawPara.columnTypeClass.list
            if(list!==undefined && list !== null){
                for(let i = 0;i<list.length;i++){
                    let temp = list[i]
                    let label = temp.label
                    if(mappingValue === label){
                        return temp.value
                    }
                }
            }
            return mappingValue
        },
        handleClose(done){
            this.$confirm('还有未保存的工作哦，确定关闭吗？')
                .then(_=>{
                    done()
                })
                .catch(_=>{})
        },
        selectTable(){
            this.innerDrawer = !this.innerDrawer
            this.innerVisible = !this.innerVisible
        },
        changeFixed(clientHeight){
            this.windowHeight = clientHeight - 120 + 'px'
        }
    }

}
</script>
<style>
.editClass .el-scrollbar_wrap{
    overflow-x: hidden;
}
</style>